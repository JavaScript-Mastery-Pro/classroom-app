import { CLOUDINARY_CLOUD_NAME } from '@/constants';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail, pad } from '@cloudinary/url-gen/actions/resize';
import { compass, focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { max } from '@cloudinary/url-gen/actions/roundCorners';
import {
  backgroundRemoval,
  grayscale,
  enhance,
} from '@cloudinary/url-gen/actions/effect';
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { format, quality, dpr } from '@cloudinary/url-gen/actions/delivery';
import { fillLight } from '@cloudinary/url-gen/actions/adjust';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import { Position } from '@cloudinary/url-gen/qualifiers/position';
// Cloudinary instance.
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

// Function to generate a Cloudinary image URL with transformations for profile photos.
export const profilePhoto = (imageCldPubId: string) =>
  cld
    .image(imageCldPubId)
    .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
    .effect(enhance())
    .adjust(fillLight().blend(50).bias(5))
    .effect(backgroundRemoval())
    .effect(grayscale())
    .roundCorners(max())
    // .border(solid(10, "white"))
    .delivery(format('auto')) // set format to auto
    .delivery(quality('auto')); // optimize quality automatically


export const bannerPhoto = (imageCldPubId: string, name: string) => {
  return cld
    .image(imageCldPubId)
    .resize(
      pad()
        .width(1200)
        .height(297)  // Aspect ratio 5:1
    )
    // .effect(enhance())
    // Optimize for web
    .delivery(format("auto"))
    .delivery(quality("auto"))
    .delivery(dpr("auto"))
    // Text overlay with name
    .overlay(
      source(
        text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
          "white"
        )
      ).position(
        new Position()
          .gravity(compass("south_west"))
          .offsetY(0.20)
          .offsetX(0.02)
      )
    );
};
