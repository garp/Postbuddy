const companyName = "Post Buddy";
const companyUrl = "https://postbuddy.ai";
const companyLinkHTML = `<a href=${companyUrl} style='text-decoration: none;color: inherit;'>${companyName}</a>`;
const companyLogo =
  "https://postbuddy.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9af83827.png&w=64&q=75";

const socialMedia = {
  facebook: {
    link: "https://postbuddy.ai",
    image: "https://postbuddy.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9af83827.png&w=64&q=75",
  },
  instagram: {
    link: "https://postbuddy.ai",
    image: "https://postbuddy.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9af83827.png&w=64&q=75",
  },
  linkdin: {
    link: "https://postbuddy.ai",
    image: "https://postbuddy.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9af83827.png&w=64&q=75",
  },
  youtube: {
    link: "https://postbuddy.ai",
    image: "https://postbuddy.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9af83827.png&w=64&q=75",
  },
};

export const startingHTML = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header style="overflow: hidden;">
        <div style="float: left; margin: 15px;">
            <img src=${companyLogo}
                alt="">
        </div>
        <div style="float: right;">
            <div style="margin: 25px;">
                <a>
                    <img src=${socialMedia.facebook.image}
                        alt="" style="float: left; margin-right: 20px;">
                </a>
                <a>
                    <img src=${socialMedia.instagram.image}
                        alt="" style="float: left; margin-right: 20px;">
                </a>
                <a>
                    <img src=${socialMedia.linkdin.image}
                        alt="" style="float: left; margin-right: 20px;">
                </a>
                <a>
                    <img src=${socialMedia.youtube.image}
                        alt="" style="float: left;">
                </a>
            </div>
        </div>
    </header>
    <div style="text-align: center; margin: 20px;">`;

export const endingHTML =
  () => `    <footer style="text-align: center; padding: 20px;">
<div>
    <a style="text-decoration: none;">
        <img src=${socialMedia.facebook.image}
            alt="" style="margin-right: 20px;">
    </a>
    <a style="text-decoration: none;">
        <img src=${socialMedia.instagram.image}
            alt="" style="margin-right: 20px;">
    </a>
    <a style="text-decoration: none;">
        <img src=${socialMedia.linkdin.image}
            alt="" style="margin-right: 20px;">
    </a>
    <a style="text-decoration: none;">
        <img src=${socialMedia.youtube.image}
            alt="">
    </a>
</div>
<h3 style="margin-top: 20px;">INFINITE GREEN Inc.</h3>
<p>No longer want to receive these emails? <a style="text-decoration: none; color: #007bff;"
        href=" ">Unsubscribe</a></p>
</footer>
</body>
</html>`;