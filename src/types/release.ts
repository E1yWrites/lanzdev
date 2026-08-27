import { Platform } from "./project";

export interface ReleaseAsset {
  name: string;
  size: number;
  downloadUrl: string;
  contentType: string;
}

export interface Release {
  tagName: string;
  name: string;
  publishedAt: string;
  body: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

export interface PlatformDownload {
  platform: Platform;
  available: boolean;
  asset?: ReleaseAsset;
  version?: string;
  architecture?: string;
  fileSize?: string;
  comingSoon?: boolean;
}
