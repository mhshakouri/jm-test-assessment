// import { lookup } from 'mime-types';
// import sizeOf from 'image-size';
// import type { ImageSize } from '../types/utils/imageSize';
// export async function getImageSize(imageUrl: string): Promise<ImageSize | null> {
//     try {
//         const response = await fetch(imageUrl, { method:'HEAD', headers: { 'Range': 'bytes=0-64'}});
//         const buffer = await response.arrayBuffer();
//         const dimensions = sizeOf(new Uint8Array(buffer));
//         const mimeType = lookup(imageUrl);
//         return {
//             width: dimensions.width,
//             height: dimensions.height,
//             aspectRatio: `${dimensions.width / dimensions.height}/1`,
//             type: mimeType ?? dimensions.type ? `image/${dimensions.type}` : undefined,
//         };
//     } catch (error) {
//         console.error('Error getting image size:', error);
//         return null;
//     }
// }