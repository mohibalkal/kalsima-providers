import { Flags } from '@/entrypoint/utils/targets';
import { Stream } from '@/providers/streams';
import { EmbedScrapeContext, MovieScrapeContext, ShowScrapeContext } from '@/utils/context';

export type MediaScraperTypes = 'show' | 'movie';

export type SourcererEmbed = {
  embedId: string;
  url: string;
};

const usedRanks = new Set<number>();

export type SourcererOutput = {
  embeds: Array<{
    id: string;
    embedScraperId: string;
  }>;
  stream?: Stream[];
};

export type SourcererOptions = {
  id: string;
  name: string; // displayed in the UI
  rank: number; // the higher the number, the earlier it gets put on the queue
  disabled?: boolean;
  // these sources are built in but not used by default
  // this can have many uses, we use this for sources that only work on official instances
  externalSource?: boolean;
  flags: Flags[];
  scrapeMovie?: (input: MovieScrapeContext) => Promise<SourcererOutput>;
  scrapeShow?: (input: ShowScrapeContext) => Promise<SourcererOutput>;
};

export type Sourcerer = {
  type: 'source';
  id: string;
  name: string;
  rank: number;
  disabled?: boolean;
  mediaTypes?: Array<MediaScraperTypes>;
  flags?: Array<Flags>;
  scrapeMovie?: (ctx: MovieScrapeContext) => Promise<SourcererOutput>;
  scrapeShow?: (ctx: ShowScrapeContext) => Promise<SourcererOutput>;
};

export function makeSourcerer(ops: Omit<Sourcerer, 'type'>): Sourcerer {
  // التحقق من تكرار الترتيب
  if (usedRanks.has(ops.rank)) {
    throw new Error(`Duplicate rank ${ops.rank} found in source ${ops.id}`);
  }
  usedRanks.add(ops.rank);

  return {
    type: 'source',
    ...ops,
  };
}

export type EmbedOutput = {
  stream: Stream[];
};

export type EmbedOptions = {
  id: string;
  name: string; // displayed in the UI
  rank: number; // the higher the number, the earlier it gets put on the queue
  disabled?: boolean;
  scrape: (input: EmbedScrapeContext) => Promise<EmbedOutput>;
};

export type Embed = EmbedOptions & {
  type: 'embed';
  disabled: boolean;
  mediaTypes: undefined;
};

export function makeEmbed(state: EmbedOptions): Embed {
  return {
    ...state,
    type: 'embed',
    disabled: state.disabled ?? false,
    mediaTypes: undefined,
  };
}
