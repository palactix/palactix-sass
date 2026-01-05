import type { Metadata } from "next";

type MetaOptions = {
  title: string;
  description: string;

  og?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export function createMetadata({
  title,
  description,
  og: { title: ogTitle, description: ogDescription } = {},
}: MetaOptions): Metadata {
  return {
    title,
    description,

    // openGraph: {
    //   title: ogTitle ?? title,
    //   description: ogDescription ?? description,
    // },

    // twitter: {
    //   title: ogTitle ?? title,
    //   description: ogDescription ?? description,
    // },
  };
}