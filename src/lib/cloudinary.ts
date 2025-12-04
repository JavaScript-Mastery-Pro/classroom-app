import { CLOUDINARY_CLOUD_NAME } from '@/constants';
// import { Cloudinary, Transformation } from '@cloudinary/url-gen';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { backgroundRemoval, grayscale } from "@cloudinary/url-gen/actions/effect";
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { enhance } from "@cloudinary/url-gen/actions/effect";
import { fillLight } from "@cloudinary/url-gen/actions/adjust";
// import { source } from "@cloudinary/url-gen/actions/overlay";
// import { image } from "@cloudinary/url-gen/qualifiers/source";
// import { Position } from "@cloudinary/url-gen/qualifiers/position";
// import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
// import { opacity, brightness } from "@cloudinary/url-gen/actions/adjust";
// import { scale } from "@cloudinary/url-gen/actions/resize";

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
    .delivery(quality('auto')) // optimize quality automatically
    // .overlay(
    //   source(image("classroom-app/users/fbq0xghpmbel9ubtgxmg").transformation(
    //     new Transformation()
    //       .resize(scale(6).width(1.9))
    //       .adjust(opacity(70))
    //   ))
    //    .position(new Position().gravity(compass("south")))
    // );

  