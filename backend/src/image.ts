import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

import { INameFreq } from './data';

const degreeToRad = (x:number) => x * (Math.PI / 180)

interface IConfig {
  users: INameFreq[];
  count: number;
  radius: number;
  distance: number;
}

export const render = async (config: IConfig[]) => {

  const width  = 1000;
  const height = 1000;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#634AB4";
  ctx.fillRect(0, 0, width, height);

  // each layer is an iteration
  for (const [layerIndex, layer] of config.entries()) {

    const {
      count,
      radius,
      distance,
      users
    } = layer;

    const angleSize = 360 / count;

    // each circle of the layer is an iteration
    for (let i=0; i < count; i++) {
      const offset = layerIndex * 30;
      const r = degreeToRad(i * angleSize + offset);

      const centerX = Math.cos(r) * distance + width / 2
      const centerY = Math.sin(r) * distance + height / 2

      if (!users[i]) break;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();

      const defaultAvatarUrl = "https://www.farcaster.xyz/img/logo_48.png";
      const avatarUrl = users[i].avatarUrl || defaultAvatarUrl;

      const img = await loadImage(avatarUrl);
      ctx.drawImage(
        img,
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
      );

      ctx.restore();
    }
  }

  const out = fs.createWriteStream("./circle.png");
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log("Done!"))
};
