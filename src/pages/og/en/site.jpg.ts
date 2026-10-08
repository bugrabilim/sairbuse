import type { APIRoute } from 'astro';
import { siteGorseli } from '../../../lib/og';
import { tumSiirler } from '../../../lib/siirler';

export const GET: APIRoute = async () => {
  const acilis = (await tumSiirler()).find((s) => s.id === '2011-07-18-moda');
  return new Response((await siteGorseli(acilis, 'en')) as BodyInit, { headers: { 'Content-Type': 'image/jpeg' } });
};
