import type { APIRoute } from 'astro';
import { siteGorseli } from '../../lib/og';

export const GET: APIRoute = async () =>
  new Response((await siteGorseli()) as BodyInit, { headers: { 'Content-Type': 'image/png' } });
