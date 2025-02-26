# contributions
visualize your github contributions graph in 3D!   
![](./src/app/opengraph-image.png)   


# Cool Features
- Fully customizable.   
- Export to STL ascii or binary for 3D printing.   
- Embed anywhere.   

# Customizations
### theme
theme to be used throughout the app.   
can be any hex color, minus the `#`.   
for example: `https://g3c.vercel.app?username=tool3&theme=ccff00`

### menu
show or hide menu.   
can be `true` or `false`.   
for example: `https://g3c.vercel.app?username=tool3&menu=false`

### font
font to use for text.   
can be `geistmono`, `grotesque`, `inter`, `monaspace`.   
for example: `https://g3c.vercel.app?username=tool3&font=grotesque`

### material
material to use for bars and text.   
can be `standard` or `matcap`.   
for example: `https://g3c.vercel.app?username=tool3&material=matcap`

### matcap
matcap to be used for bars and text.   
only applied if `material` is set to `matcap`.   
use `matcap_` prefix and any number between 0 and 60.   
for example: `https://g3c.vercel.app?username=tool3&material=matcap&matcap=matcap_33`


# Running locally
here are the steps to run this project locally:   
1. clone this repo and npm install `git clone https://github.com/tool3/contributions && cd contributions/ && npm install`
2. create a `.env` file in the root directory of the project.
3. Add the following environment variables:   
    a. `NEXT_PUBLIC_SITE_URL=http://localhost:3000` - if a different port is used update here.   
    b. `GITHUB_TOKEN` - this should be a github access token with repo read.  

For your convenience, change `<YOUR_TOKEN>` below to your github access token and copy this entire block into your terminal to run all of the above steps.

```bash
git clone https://github.com/tool3/contributions \
&&  cd contributions/ \
&& npm install \
&& touch .env \
&& echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >>> .env \
&& echo GITHUB_TOKEN=<YOUR_TOKEN> >>> .env
```

# Got a suggestion?
Open an issue! I'd love to hear your feedback!   