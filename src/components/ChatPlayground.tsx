import { useEffect, useRef } from 'react'
import {
  playGameCollision,
  playGameStep,
  unlockGameSfx,
} from '../lib/gameSfx'

type Props = {
  playerName: string
  otherNames: string[]
  active: boolean
}

const CELL = 32
const SCALE = 2
const TILE = 36
const SUB = 2
const STEP = TILE / SUB
const MOVE_SPEED = 95
const IDLE_SPEED = 800
const WALK_SPEED = 150
const MAP_W = 18
const MAP_H = 18
const MAP_CW = MAP_W * SUB
const MAP_CH = MAP_H * SUB
const DIRS = ['up', 'down', 'left', 'right'] as const
const NPC_ALPHA = 0.78

/** Local assets (downloaded into /public) */
const ASSET = {
  character: '/game/character.png',
  shadow: '/game/character_shadow.png',
  desk: '/game/desk.png',
  table: '/game/table.png',
  computer: '/game/computer.png',
  big_table: '/game/big_table.png',
  cabinet_1: '/game/cabinet_1.png',
  cabinet_2: '/game/cabinet_2.png',
  cabinet_3: '/game/cabinet_3.png',
}

const ROW = {
  IDLE_DOWN: 0,
  IDLE_RIGHT: 32,
  IDLE_UP: 64,
  WALK_DOWN: 96,
  WALK_RIGHT: 128,
  WALK_UP: 160,
}

const FOOT: Record<string, { w: number; h: number }> = {
  desk: { w: 2, h: 1 },
  table: { w: 2, h: 1 },
  bigtable: { w: 2, h: 2 },
  cabinet: { w: 1, h: 1 },
}

const OBJECTS = [
  { type: 'desk', x: 3, y: 2 },
  { type: 'desk', x: 13, y: 2 },
  { type: 'cabinet', x: 2, y: 6, v: 1 },
  { type: 'cabinet', x: 15, y: 6, v: 2 },
  { type: 'table', x: 4, y: 14, computer: true },
  { type: 'bigtable', x: 11, y: 12 },
  { type: 'cabinet', x: 14, y: 15, v: 3 },
] as const

/** Skin / outfit tints — real character colors (not flat grey) */
const PLAYER_TINT = { skin: [232, 180, 140], cloth: [70, 120, 210], accent: [40, 40, 48] }
const NPC_TINTS = [
  { skin: [240, 200, 160], cloth: [220, 90, 90], accent: [40, 40, 48] },
  { skin: [210, 160, 120], cloth: [90, 180, 120], accent: [40, 40, 48] },
  { skin: [250, 220, 190], cloth: [180, 120, 220], accent: [40, 40, 48] },
  { skin: [190, 140, 100], cloth: [240, 180, 60], accent: [40, 40, 48] },
  { skin: [225, 185, 155], cloth: [80, 180, 200], accent: [40, 40, 48] },
]

type Dir = (typeof DIRS)[number]
type Tint = { skin: number[]; cloth: number[]; accent: number[] }

type Actor = {
  cellX: number
  cellY: number
  pixelX: number
  pixelY: number
  direction: Dir
  isMoving: boolean
  animationFrame: number
  animationTime: number
  moveAnim: number | null
  stepCount: number
  name: string
  tint: Tint
  sheet: HTMLCanvasElement | null
  brain?: { dir: Dir | null; steps: number; pauseUntil: number }
  _dx?: number
  _dy?: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

/**
 * Knock out pure-black background + colorize greyscale character into
 * skin + cloth tones so it reads as a real person, not a grey blob.
 */
function colorizeCharacterSheet(
  src: HTMLImageElement,
  tint: Tint,
): HTMLCanvasElement {
  const w = src.naturalWidth
  const h = src.naturalHeight
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const x = c.getContext('2d')!
  x.drawImage(src, 0, 0)
  const img = x.getImageData(0, 0, w, h)
  const d = img.data

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    const a = d[i + 3]
    // Near-black → transparent (sheet bg)
    if (a < 8 || (r < 14 && g < 14 && b < 14)) {
      d[i + 3] = 0
      continue
    }
    // Luminance of greyscale pixel (0 = dark outline, 1 = light fill)
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Dark pixels = hair/outline, mid = clothes, light = skin/highlights
    let tr: number
    let tg: number
    let tb: number
    if (lum < 0.28) {
      // outline / hair / shoes
      tr = tint.accent[0] * (0.4 + lum)
      tg = tint.accent[1] * (0.4 + lum)
      tb = tint.accent[2] * (0.4 + lum)
    } else if (lum < 0.55) {
      // clothing
      const k = (lum - 0.28) / 0.27
      tr = tint.cloth[0] * (0.55 + k * 0.45)
      tg = tint.cloth[1] * (0.55 + k * 0.45)
      tb = tint.cloth[2] * (0.55 + k * 0.45)
    } else {
      // skin / face / hands
      const k = (lum - 0.55) / 0.45
      tr = tint.skin[0] * (0.7 + k * 0.35)
      tg = tint.skin[1] * (0.7 + k * 0.35)
      tb = tint.skin[2] * (0.7 + k * 0.35)
    }

    d[i] = Math.min(255, tr)
    d[i + 1] = Math.min(255, tg)
    d[i + 2] = Math.min(255, tb)
    d[i + 3] = a
  }

  x.putImageData(img, 0, 0)
  return c
}

function processFurniture(src: HTMLImageElement): HTMLCanvasElement {
  const w = src.naturalWidth
  const h = src.naturalHeight
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const x = c.getContext('2d')!
  x.drawImage(src, 0, 0)
  const img = x.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    // White-ish UI export bg → transparent
    if (r > 245 && g > 245 && b > 245) {
      d[i + 3] = 0
      continue
    }
    // Black bg on some assets
    if (r < 10 && g < 10 && b < 10) {
      d[i + 3] = 0
      continue
    }
    // Soft warm wood / metal recolor for greys
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    d[i] = Math.min(255, 90 + lum * 120)
    d[i + 1] = Math.min(255, 75 + lum * 100)
    d[i + 2] = Math.min(255, 60 + lum * 80)
  }
  x.putImageData(img, 0, 0)
  return c
}

/**
 * Mini office playground — real pixel characters, footstep + bump SFX, WASD.
 */
export default function ChatPlayground({
  playerName,
  otherNames,
  active,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerNameRef = useRef(playerName)
  const otherNamesRef = useRef(otherNames)
  playerNameRef.current = playerName
  otherNamesRef.current = otherNames

  useEffect(() => {
    if (!active) return
    const el = canvasRef.current
    if (!el) return
    const canvas: HTMLCanvasElement = el
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx

    let VIEW_W = 460
    let VIEW_H = 380
    let running = true
    let raf = 0
    let lastT = performance.now()
    let lastMove = 0
    let assetsReady = false

    // ── Assets ───────────────────────────────────────────────────────
    let shadowSheet: HTMLCanvasElement | null = null
    const furn: Record<string, HTMLCanvasElement> = {}
    const tintedSheets = new Map<string, HTMLCanvasElement>()
    let baseChar: HTMLImageElement | null = null

    function sheetKey(tint: Tint) {
      return `${tint.cloth.join(',')}|${tint.skin.join(',')}`
    }

    function getSheet(tint: Tint, base: HTMLImageElement | null) {
      if (!base?.naturalWidth) return null
      const key = sheetKey(tint)
      let s = tintedSheets.get(key)
      if (!s) {
        s = colorizeCharacterSheet(base, tint)
        tintedSheets.set(key, s)
      }
      return s
    }

    const blocked = new Set<string>()
    for (const o of OBJECTS) {
      const f = FOOT[o.type]
      const ox = o.x * SUB
      const oy = o.y * SUB
      const fw = f.w * SUB
      const fh = f.h * SUB
      for (let yy = 0; yy < fh - 1; yy++) {
        for (let xx = 0; xx < fw; xx++) {
          blocked.add(`${ox + xx},${oy + yy}`)
        }
      }
    }

    function makeActor(cx: number, cy: number, name = '', tint: Tint = PLAYER_TINT): Actor {
      return {
        cellX: cx,
        cellY: cy,
        pixelX: cx * STEP,
        pixelY: cy * STEP,
        direction: 'down',
        isMoving: false,
        animationFrame: 0,
        animationTime: 0,
        moveAnim: null,
        stepCount: 0,
        name,
        tint,
        sheet: null,
      }
    }

    function pickStart(): [number, number] {
      const ccx = (MAP_CW / 2) | 0
      const ccy = (MAP_CH / 2) | 0
      let best: [number, number] | null = null
      let bestD = Infinity
      for (let y = 0; y < MAP_CH; y++) {
        for (let x = 0; x < MAP_CW; x++) {
          if (blocked.has(`${x},${y}`)) continue
          const d = (x - ccx) ** 2 + (y - ccy) ** 2
          if (d < bestD) {
            bestD = d
            best = [x, y]
          }
        }
      }
      return best || [ccx, ccy]
    }

    const start = pickStart()
    const player = makeActor(start[0], start[1], playerNameRef.current || 'you', PLAYER_TINT)
    let npcs: Actor[] = []
    let actors: Actor[] = [player]
    const keys = { w: false, a: false, s: false, d: false }

    void (async () => {
      try {
        const [char, shadow, desk, table, computer, big, c1, c2, c3] =
          await Promise.all([
            loadImage(ASSET.character),
            loadImage(ASSET.shadow),
            loadImage(ASSET.desk),
            loadImage(ASSET.table),
            loadImage(ASSET.computer),
            loadImage(ASSET.big_table),
            loadImage(ASSET.cabinet_1),
            loadImage(ASSET.cabinet_2),
            loadImage(ASSET.cabinet_3),
          ])
        baseChar = char
        {
          const c = document.createElement('canvas')
          c.width = shadow.naturalWidth
          c.height = shadow.naturalHeight
          const x = c.getContext('2d')!
          x.drawImage(shadow, 0, 0)
          const data = x.getImageData(0, 0, c.width, c.height)
          for (let i = 0; i < data.data.length; i += 4) {
            if (
              data.data[i] < 14 &&
              data.data[i + 1] < 14 &&
              data.data[i + 2] < 14
            ) {
              data.data[i + 3] = 0
            }
          }
          x.putImageData(data, 0, 0)
          shadowSheet = c
        }
        furn.desk = processFurniture(desk)
        furn.table = processFurniture(table)
        furn.computer = processFurniture(computer)
        furn.big_table = processFurniture(big)
        furn.cabinet_1 = processFurniture(c1)
        furn.cabinet_2 = processFurniture(c2)
        furn.cabinet_3 = processFurniture(c3)

        player.sheet = getSheet(PLAYER_TINT, baseChar)
        player.tint = PLAYER_TINT
        npcs.forEach((n) => {
          n.sheet = getSheet(n.tint, baseChar)
        })
        assetsReady = true
      } catch (e) {
        console.warn('Playground assets failed', e)
        assetsReady = false
      }
    })()

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v
    }

    function isDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark'
    }

    function theme() {
      return isDark()
        ? {
            grid: 'rgba(240,240,245,0.09)',
            name: '#f4f4f5',
            npcName: '#a6a6ad',
            nameShadow: 'rgba(0,0,0,.85)',
            objShadow: 'rgba(0,0,0,0.32)',
          }
        : {
            grid: 'rgba(10,10,12,0.08)',
            name: '#0a0a0a',
            npcName: '#6d6d72',
            nameShadow: 'rgba(255,255,255,.9)',
            objShadow: 'rgba(0,0,0,0.14)',
          }
    }

    function frame(actor: Actor) {
      const d = actor.direction
      const moving = actor.isMoving
      let rowY: number
      let count: number
      if (moving) {
        rowY =
          d === 'up'
            ? ROW.WALK_UP
            : d === 'down'
              ? ROW.WALK_DOWN
              : ROW.WALK_RIGHT
        count = 4
      } else {
        rowY =
          d === 'up'
            ? ROW.IDLE_UP
            : d === 'down'
              ? ROW.IDLE_DOWN
              : ROW.IDLE_RIGHT
        count = 2
      }
      const cf = Math.floor(actor.animationFrame || 0) % count
      return { x: cf * CELL, y: rowY, flip: d === 'left' }
    }

    function canMoveTo(cx: number, cy: number, mover: Actor) {
      if (cx < 0 || cx >= MAP_CW || cy < 0 || cy >= MAP_CH) return false
      if (blocked.has(`${cx},${cy}`)) return false
      for (const a of actors) {
        if (a === mover) continue
        if (Math.abs(a.cellX - cx) < SUB && Math.abs(a.cellY - cy) < SUB)
          return false
      }
      return true
    }

    function startSlide(actor: Actor, tPX: number, tPY: number) {
      const sX = actor.pixelX
      const sY = actor.pixelY
      const st = performance.now()
      const anim = (t: number) => {
        const p = Math.min((t - st) / MOVE_SPEED, 1)
        const e = 1 - Math.pow(1 - p, 2)
        actor.pixelX = sX + (tPX - sX) * e
        actor.pixelY = sY + (tPY - sY) * e
        if (p < 1) actor.moveAnim = requestAnimationFrame(anim)
        else {
          actor.pixelX = tPX
          actor.pixelY = tPY
          actor.moveAnim = null
        }
      }
      actor.moveAnim = requestAnimationFrame(anim)
    }

    function handleMovement() {
      let dir: Dir | null = null
      if (keys.s) dir = 'down'
      if (keys.d) dir = 'right'
      if (keys.w) dir = 'up'
      if (keys.a) dir = 'left'
      if (!dir) {
        player.isMoving = false
        return
      }
      if (player.moveAnim) {
        player.isMoving = true
        return
      }
      player.direction = dir
      const atTarget =
        Math.abs(player.pixelX - player.cellX * STEP) < 0.5 &&
        Math.abs(player.pixelY - player.cellY * STEP) < 0.5
      if (!atTarget) {
        player.isMoving = true
        return
      }
      const now = Date.now()
      if (now - lastMove < MOVE_SPEED * 0.3) return
      let nx = player.cellX
      let ny = player.cellY
      if (dir === 'up') ny--
      else if (dir === 'down') ny++
      else if (dir === 'left') nx--
      else nx++
      if (!canMoveTo(nx, ny, player)) {
        player.isMoving = false
        playGameCollision(dir)
        return
      }
      player.isMoving = true
      player.cellX = nx
      player.cellY = ny
      lastMove = now
      player.stepCount++
      // Footstep every sub-step so walking is clearly audible
      playGameStep()
      startSlide(player, nx * STEP, ny * STEP)
    }

    function npcStep(npc: Actor) {
      if (!npc.brain) return
      if (npc.moveAnim) {
        npc.isMoving = true
        return
      }
      const atTarget =
        Math.abs(npc.pixelX - npc.cellX * STEP) < 0.5 &&
        Math.abs(npc.pixelY - npc.cellY * STEP) < 0.5
      if (!atTarget) {
        npc.isMoving = true
        return
      }
      const now = Date.now()
      const b = npc.brain
      if (now < b.pauseUntil) {
        npc.isMoving = false
        return
      }
      if (b.steps <= 0 || !b.dir) {
        if (Math.random() < 0.34) {
          b.pauseUntil = now + 700 + Math.random() * 2600
          b.dir = null
          npc.isMoving = false
          return
        }
        b.dir = DIRS[(Math.random() * 4) | 0]
        b.steps = SUB * (1 + ((Math.random() * 4) | 0))
      }
      npc.direction = b.dir
      let nx = npc.cellX
      let ny = npc.cellY
      if (b.dir === 'up') ny--
      else if (b.dir === 'down') ny++
      else if (b.dir === 'left') nx--
      else nx++
      if (!canMoveTo(nx, ny, npc)) {
        b.steps = 0
        b.dir = null
        b.pauseUntil = now + 250 + Math.random() * 800
        npc.isMoving = false
        return
      }
      npc.isMoving = true
      npc.cellX = nx
      npc.cellY = ny
      b.steps--
      startSlide(npc, nx * STEP, ny * STEP)
    }

    function spawnNPCs(names: string[]) {
      const placed: [number, number][] = [[player.cellX, player.cellY]]
      const farEnough = (tx: number, ty: number) =>
        placed.every(
          ([px, py]) => Math.abs(px - tx) >= SUB || Math.abs(py - ty) >= SUB,
        )
      npcs = []
      for (let i = 0; i < 5; i++) {
        let tx = 1
        let ty = 1
        let tries = 0
        let ok = false
        do {
          tx = 1 + ((Math.random() * (MAP_CW - 2)) | 0)
          ty = 1 + ((Math.random() * (MAP_CH - 2)) | 0)
          tries++
          ok = !blocked.has(`${tx},${ty}`) && farEnough(tx, ty)
        } while (!ok && tries < 300)
        placed.push([tx, ty])
        const tint = NPC_TINTS[i % NPC_TINTS.length]
        const npc = makeActor(tx, ty, names[i] || `guest ${i + 1}`, tint)
        npc.direction = DIRS[(Math.random() * 4) | 0]
        npc.animationFrame = (Math.random() * 4) | 0
        npc.brain = {
          dir: null,
          steps: 0,
          pauseUntil: Date.now() + Math.random() * 1800,
        }
        if (baseChar) npc.sheet = getSheet(tint, baseChar)
        npcs.push(npc)
      }
      actors = [player, ...npcs]
    }

    spawnNPCs(
      otherNamesRef.current.filter((n) => n && n !== playerNameRef.current),
    )

    function updateAnim(dt: number) {
      for (const a of actors) {
        a.animationTime += dt
        if (a.animationTime >= (a.isMoving ? WALK_SPEED : IDLE_SPEED)) {
          a.animationFrame = (a.animationFrame || 0) + 1
          a.animationTime = 0
        }
      }
    }

    function drawSheetFrame(
      sheet: HTMLCanvasElement | HTMLImageElement,
      f: { x: number; y: number; flip: boolean },
      x: number,
      y: number,
      w: number,
      h: number,
    ) {
      if (f.flip) {
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(sheet, f.x, f.y, CELL, CELL, -x - w, y, w, h)
        ctx.restore()
      } else {
        ctx.drawImage(sheet, f.x, f.y, CELL, CELL, x, y, w, h)
      }
    }

    function actorDraw(a: Actor, camX: number, camY: number) {
      const isPlayer = a === player
      const f = frame(a)
      const w = CELL * SCALE
      const h = CELL * SCALE
      a._dx = Math.round(a.pixelX + (STEP - w) / 2 - camX)
      a._dy = Math.round(a.pixelY + (STEP - h) / 2 - camY)

      // Shadow under feet
      if (shadowSheet) {
        ctx.save()
        ctx.globalAlpha = isPlayer ? 0.85 : 0.4
        drawSheetFrame(shadowSheet, f, a._dx, a._dy, w, h)
        ctx.restore()
      }

      const sheet =
        a.sheet ||
        (baseChar ? getSheet(a.tint, baseChar) : null) ||
        null

      ctx.save()
      ctx.globalAlpha = isPlayer ? 1 : NPC_ALPHA
      if (sheet) {
        drawSheetFrame(sheet, f, a._dx, a._dy, w, h)
      } else if (assetsReady === false) {
        // Soft loading placeholder (not the old grey block body)
        ctx.fillStyle = `rgb(${a.tint.skin.join(',')})`
        ctx.beginPath()
        ctx.arc(a._dx + w / 2, a._dy + h * 0.35, w * 0.18, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgb(${a.tint.cloth.join(',')})`
        ctx.fillRect(a._dx + w * 0.32, a._dy + h * 0.45, w * 0.36, h * 0.32)
      }
      ctx.restore()
    }

    function actorName(a: Actor, c: ReturnType<typeof theme>) {
      if (!a.name) return
      const isPlayer = a === player
      const w = CELL * SCALE
      ctx.save()
      ctx.font = '600 11px "Geist Mono", ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = c.nameShadow
      ctx.shadowBlur = 3
      ctx.shadowOffsetY = 1
      ctx.globalAlpha = isPlayer ? 1 : 0.9
      ctx.fillStyle = isPlayer ? c.name : c.npcName
      ctx.fillText(a.name, (a._dx ?? 0) + w / 2, (a._dy ?? 0) + 8)
      ctx.restore()
    }

    function furnImg(o: (typeof OBJECTS)[number]) {
      if (o.type === 'desk') return furn.desk
      if (o.type === 'table') return furn.table
      if (o.type === 'bigtable') return furn.big_table
      return furn[`cabinet_${'v' in o ? o.v : 1}`]
    }

    function drawObject(
      o: (typeof OBJECTS)[number],
      camX: number,
      camY: number,
      c: ReturnType<typeof theme>,
    ) {
      const img = furnImg(o)
      const f = FOOT[o.type]
      const px = Math.round(o.x * TILE - camX)
      const py = Math.round(o.y * TILE - camY)
      const w = f.w * TILE
      const h = f.h * TILE
      ctx.fillStyle = c.objShadow
      ctx.fillRect(px + 2, py + 2, w, h * 0.9)
      if (img) {
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(img, px, py, w, h)
        if ('computer' in o && o.computer && furn.computer) {
          ctx.drawImage(furn.computer, px, py - TILE / 2, 2 * TILE, TILE)
        }
      }
    }

    function render() {
      const c = theme()
      ctx.imageSmoothingEnabled = false
      const camX = clamp(
        player.pixelX + STEP / 2 - VIEW_W / 2,
        0,
        MAP_W * TILE - VIEW_W,
      )
      const camY = clamp(
        player.pixelY + STEP / 2 - VIEW_H / 2,
        0,
        MAP_H * TILE - VIEW_H,
      )

      ctx.clearRect(0, 0, VIEW_W, VIEW_H)

      ctx.strokeStyle = c.grid
      ctx.lineWidth = 1
      ctx.beginPath()
      for (
        let x = Math.floor(camX / TILE) * TILE;
        x <= camX + VIEW_W;
        x += TILE
      ) {
        const sx = Math.round(x - camX) + 0.5
        ctx.moveTo(sx, 0)
        ctx.lineTo(sx, VIEW_H)
      }
      for (
        let y = Math.floor(camY / TILE) * TILE;
        y <= camY + VIEW_H;
        y += TILE
      ) {
        const sy = Math.round(y - camY) + 0.5
        ctx.moveTo(0, sy)
        ctx.lineTo(VIEW_W, sy)
      }
      ctx.stroke()

      const drawables: { y: number; run: () => void }[] = []
      for (const a of actors) {
        drawables.push({
          y: a.pixelY + STEP + 0.5,
          run: () => actorDraw(a, camX, camY),
        })
      }
      for (const o of OBJECTS) {
        drawables.push({
          y: (o.y + FOOT[o.type].h) * TILE,
          run: () => drawObject(o, camX, camY, c),
        })
      }
      drawables.sort((p, q) => p.y - q.y)
      for (const d of drawables) d.run()

      const order = actors.slice().sort((a, b) => a.pixelY - b.pixelY)
      for (const a of order) actorName(a, c)
    }

    function loop(t: number) {
      if (!running) return
      const dt = Math.min(64, t - lastT)
      lastT = t
      player.name = playerNameRef.current || 'you'
      const names = otherNamesRef.current.filter(
        (n) => n && n !== playerNameRef.current,
      )
      npcs.forEach((n, i) => {
        if (names[i]) n.name = names[i]
      })
      handleMovement()
      for (const npc of npcs) npcStep(npc)
      updateAnim(dt)
      render()
      raf = requestAnimationFrame(loop)
    }

    function setupCanvas() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (!cw || !ch) return false
      VIEW_W = cw
      VIEW_H = ch
      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return true
    }

    setupCanvas()
    raf = requestAnimationFrame(loop)

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      void unlockGameSfx()

      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') {
        e.preventDefault()
        keys.w = true
      }
      if (k === 'a' || k === 'arrowleft') {
        e.preventDefault()
        keys.a = true
      }
      if (k === 's' || k === 'arrowdown') {
        e.preventDefault()
        keys.s = true
      }
      if (k === 'd' || k === 'arrowright') {
        e.preventDefault()
        keys.d = true
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') keys.w = false
      if (k === 'a' || k === 'arrowleft') keys.a = false
      if (k === 's' || k === 'arrowdown') keys.s = false
      if (k === 'd' || k === 'arrowright') keys.d = false
    }
    const onResize = () => setupCanvas()
    const onClick = () => {
      void unlockGameSfx()
      canvas.focus()
    }
    // Also unlock when user finishes joining (first pointer anywhere in window)
    const onPointer = () => {
      void unlockGameSfx()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', onResize)
    window.addEventListener('pointerdown', onPointer, { once: true })
    canvas.addEventListener('click', onClick)

    // Unlock immediately if user already interacted with the page this session
    void unlockGameSfx()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      actors.forEach((a) => {
        if (a.moveAnim) cancelAnimationFrame(a.moveAnim)
      })
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', onPointer)
      canvas.removeEventListener('click', onClick)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="hidden lg:flex absolute right-[clamp(1.5rem,6vw,5.5rem)] top-1/2 z-[12] -translate-y-1/2 flex-col items-end pointer-events-auto">
      <div className="font-mono text-[10px] tracking-wide text-[var(--color-dim)] mb-2 pr-0.5">
        wasd / arrows to move
      </div>
      <div
        className="relative"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
          WebkitMaskComposite: 'source-in',
          maskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
          maskComposite: 'intersect',
        }}
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          width={460}
          height={380}
          className="block w-[min(460px,42vw)] h-[min(380px,48vh)] outline-none cursor-pointer"
          aria-label="Playground — WASD to move"
        />
      </div>
    </div>
  )
}
