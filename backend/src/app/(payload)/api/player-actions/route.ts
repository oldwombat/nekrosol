import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

type ActionType = 'SPD-1' | 'MED-1' | 'RAD-X' | 'BEG'

type PlayerStats = {
  id: number | string
  credits?: number | null
  creditsMax?: number | null
  energy?: number | null
  energyMax?: number | null
  health?: number | null
  healthMax?: number | null
  radiation?: number | null
  radiationMax?: number | null
  itemSpd1?: number | null
  itemMed1?: number | null
  itemRadx?: number | null
}

const asNumber = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const applyAction = (player: PlayerStats, action: ActionType) => {
  const credits = asNumber(player.credits, 0)
  const creditsMax = asNumber(player.creditsMax, 1000000)
  const energy = asNumber(player.energy, 0)
  const energyMax = asNumber(player.energyMax, 10)
  const health = asNumber(player.health, 0)
  const healthMax = asNumber(player.healthMax, 100)
  const radiation = asNumber(player.radiation, 0)
  const itemSpd1 = asNumber(player.itemSpd1, 0)
  const itemMed1 = asNumber(player.itemMed1, 0)
  const itemRadx = asNumber(player.itemRadx, 0)

  switch (action) {
    case 'SPD-1':
      return {
        data: { energy: energyMax, itemSpd1: Math.max(0, itemSpd1 - 1) },
      }
    case 'MED-1':
      return {
        data: { health: healthMax, itemMed1: Math.max(0, itemMed1 - 1) },
      }
    case 'RAD-X':
      return {
        data: { radiation: Math.max(0, radiation - 10), itemRadx: Math.max(0, itemRadx - 1) },
      }
    case 'BEG': {
      const gain = Math.floor(Math.random() * 5) + 1
      return {
        data: {
          credits: Math.min(credits + gain, creditsMax),
          energy: Math.max(0, energy - 1),
        },
        gain,
      }
    }
  }
}

export const POST = async (request: Request) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.collection !== 'players') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    const action = body?.action as ActionType | undefined

    if (!action || !['SPD-1', 'MED-1', 'RAD-X', 'BEG'].includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }

    const player = (await payload.findByID({
      collection: 'players',
      id: user.id,
      depth: 0,
      overrideAccess: true,
    })) as PlayerStats

    if (action === 'BEG' && asNumber(player.energy, 0) < 1) {
      return Response.json({ error: 'Not enough energy' }, { status: 400 })
    }

    if (action === 'SPD-1' && asNumber(player.itemSpd1, 0) < 1) {
      return Response.json({ error: 'No SPD-1 items left' }, { status: 400 })
    }

    if (action === 'MED-1' && asNumber(player.itemMed1, 0) < 1) {
      return Response.json({ error: 'No MED-1 items left' }, { status: 400 })
    }

    if (action === 'RAD-X' && asNumber(player.itemRadx, 0) < 1) {
      return Response.json({ error: 'No RAD-X items left' }, { status: 400 })
    }

    const result = applyAction(player, action)

    const updatedPlayer = await payload.update({
      collection: 'players',
      id: user.id,
      data: result.data,
      overrideAccess: true,
      depth: 0,
    })

    return Response.json({
      ok: true,
      action,
      gain: result.gain,
      player: updatedPlayer,
    })
  } catch (error) {
    console.error('player-actions error', error)
    return Response.json({ error: 'Action failed' }, { status: 500 })
  }
}
