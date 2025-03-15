import { flags } from '@/entrypoint/utils/targets';
import { SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

// thanks uira for this api!
const baseUrl$1 = 'https://6x3d4pm9r7k2v8h1q56.uira.live/';
async function comboScraper$3(ctx: MovieScrapeContext | ShowScrapeContext): Promise<SourcererOutput> {
  const fetchUrl = `${baseUrl$1}all/${ctx.media.tmdbId}${ctx.media.type === 'movie' ? '' : `?s=${ctx.media.season.number}&e=${ctx.media.episode.number}`}`;
  let result;
  try {
    result = await ctx.fetcher(fetchUrl);
  } catch (e) {
    if (e instanceof NotFoundError) throw new NotFoundError(`uiralive: ${e.message}`);
    throw e;
  }
  if (!result) {
    try {
      result = await ctx.fetcher(fetchUrl);
    } catch (e) {
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
        type: 'hls' as const,
        flags: [flags.CORS_ALLOWED],
        captions: result.captions || [],
      },
    ],
  };
}
export const uiraliveScraper = makeSourcerer({
  id: 'uiralive',
  name: 'Uira 🔥',
  rank: 940,
  disabled: true,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: comboScraper$3,
  scrapeShow: comboScraper$3,
});
