import { flags } from '@/entrypoint/utils/targets';
import { SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

// thanks uira for this api!
<<<<<<< HEAD
const baseUrl$1 = 'https://6x3d4pm9r7k2v8h1q56.uira.live/';
async function comboScraper$3(ctx: MovieScrapeContext | ShowScrapeContext): Promise<SourcererOutput> {
  const fetchUrl = `${baseUrl$1}all/${ctx.media.tmdbId}${ctx.media.type === 'movie' ? '' : `?s=${ctx.media.season.number}&e=${ctx.media.episode.number}`}`;
=======
const baseUrl = 'https://xj4h5qk3tf7v2mlr9s.uira.live/';

async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  const fetchUrl = `${baseUrl}all/${ctx.media.tmdbId}${
    ctx.media.type === 'movie' ? '' : `?s=${ctx.media.season.number}&e=${ctx.media.episode.number}`
  }`;

>>>>>>> 76e5f695992f0e54ccaa2e9198405f077fb91866
  let result;
  try {
    result = await ctx.fetcher(fetchUrl);
  } catch (e: any) {
    if (e instanceof NotFoundError) throw new NotFoundError(`uiralive: ${e.message}`);
    throw e;
  }

  if (!result) {
    try {
      result = await ctx.fetcher(fetchUrl);
    } catch (e: any) {
      if (e instanceof NotFoundError) throw new NotFoundError(`uiralive: ${e.message}`);
      throw e;
    }
  }

  if (!result || !result.sources || result.sources.length === 0) {
    throw new NotFoundError('uiralive: No sources found');
  }

  ctx.progress(90);

  if (!result.sources[0].url) {
    throw new Error('uiralive: Source URL is missing');
  }

  return {
    embeds: [],
    stream: [
      {
        id: 'primary',
        playlist: result.sources[0].url,
<<<<<<< HEAD
        type: 'hls' as const,
=======
        type: 'hls',
>>>>>>> 76e5f695992f0e54ccaa2e9198405f077fb91866
        flags: [flags.CORS_ALLOWED],
        captions: result.captions || [],
      },
    ],
  };
}
<<<<<<< HEAD
=======

>>>>>>> 76e5f695992f0e54ccaa2e9198405f077fb91866
export const uiraliveScraper = makeSourcerer({
  id: 'uiralive',
  name: 'Uira 🔥',
  rank: 940,
  disabled: true,
  flags: [flags.CORS_ALLOWED],
<<<<<<< HEAD
  scrapeMovie: comboScraper$3,
  scrapeShow: comboScraper$3,
=======
  scrapeMovie: comboScraper,
  scrapeShow: comboScraper,
>>>>>>> 76e5f695992f0e54ccaa2e9198405f077fb91866
});
