import type { APIRoute, GetStaticPaths } from 'astro';
import { tumSiirler, type Siir } from '../../../lib/siirler';
import { siirGorseli } from '../../../lib/og';

export const getStaticPaths = (async () => {
  const tum = await tumSiirler();
  return tum.map((siir) => ({ params: { slug: siir.id }, props: { siir } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const govde = await siirGorseli((props as { siir: Siir }).siir, 'en');
  return new Response(govde as BodyInit, { headers: { 'Content-Type': 'image/jpeg' } });
};
