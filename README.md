# Avatar Library
A library for uploading and generating avatars.

## How to install
```bash
npm install @voicenter/avatars;
```

Importing using ES6 modules:
```js
import { Avatar } from "@voicenter/avatars";
```

Importing using CommonJS:
```js
const { Avatar } = require("@voicenter/avatars");
```
## How to use
Create an instance of the `Avatar` class
```js
const avatar = new Avatar(config);
```
where`config` is a config object

```js
{
  avatarsPath: string; // path to folder with saved avatars
  templatesPath: string; // path to folder with templates
  sizes?: Array<number>; // sizes of images to save [optional]
}
```

Example:
```js
{
  avatarsPath: "./src/media",
  templatesPath: "./src/templates"
}
```
To generate images of custom sizes, add `sizes` to the config. Default sizes are `168, 32, 24`
```js
{
  avatarsPath: "./src/media",
  templatesPath: "./src/templates",
  sizes: [300, 200, 100]        
}
```

## Library methods

### Avatar.upload
----
  Uploads the avatar image in sizes provided in config or default sizes (`168x168`, `32x32` and `24x24`).

The images are saved as `src/media/<AvatarAccountID>/<AccountID>/<size>.png`


* **Arguments**
* `inputBody` [object] [required]:
  * `AvatarAccountID` [integer] [required]: ID of the Account.
  * `AvatarID` [integer] [required]: ID of the Avatar.
  * `AvatarData` [object] [required]:
      * `Coordinates : {top, left, width, height }` [Object<integer>] [required]: Object of coordinates for crop. Check the image below to understand the meaning of the object properties. If you don't want to crop the image, set `top: 0, left: 0, width: <width of the image>, height: <height of the image>`
      * `File` [string] [required]: Base64 encoded image. For test you can convert image to Base64 here: <https://www.base64-image.de/>  


![alt text](https://i.ibb.co/NyryN25/image-2.png)

* **Example:**

```js
avatar.upload({
  AvatarAccountID: 21,
  AvatarID: 3,
  AvatarData: {
    Coordinates: { width: 100, height: 100, left: 20, top: 20 },
    File: "data:image/jpeg;base64,/9j/4AAAABBGQ...",
  },
});

```



### Avatar.generateFromTemplate
----
  Generates the avatar image from present template and saves it in sizes provided in config or default sizes (`168x168`, `32x32` and `24x24`) using the template and background color given in the input object.

The images are saved as `src/media/<AvatarAccountID>/<AccountID>/<size>.png`

* **Arguments**

* `inputBody` [object] [required]:
  * `AvatarAccountID` [integer] [required]: ID of the Account.
  * `AvatarID` [integer] [required]: ID of the Avatar.
  * `AvatarData` [object] [required]:
      * `Hex` [string] [required]: hex color of the background
      * `TemplateID` [integer] [required]: ID of the template  



* **Example:**

```js
avatar.generateFromTemplate({
  AvatarAccountID: 21,
  AvatarID: 2,
  AvatarData: { TemplateID: 1, Hex: "#640a82" },
});
```

### Avatar.generateFromContent
----
Generates the avatar image with given text and saves it in sizes provided in config or default sizes (`168x168`, `32x32` and `24x24`) using the background color given in the input object.

The images are saved as `src/media/<AvatarAccountID>/<AccountID>/<size>.png`

* **Arguments**

* `inputBody` [object] [required]:
  * `AvatarAccountID` [integer] [required]: ID of the Account.
  * `AvatarID` [integer] [required]: ID of the Avatar.
  * `AvatarData` [object] [required]:
    * `Hex` [string] [required]: hex color of the background
    * `Content` [string] [required]: Text to be placed on the image



* **Example:**

```js
avatar.generateFromContent({
  AvatarAccountID: 21,
  AvatarID: 4,
  AvatarData: { Content: "SZ", Hex: "#640a82" },
});
```