# Avatar Libarry
A library for uploading and generating avatars

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
  sizes: Array<number>; // sizes of images to save
}
```

If `config = {}`, then the class instance will be created with default config:
```js
{
  avatarsPath: "./src/media",
  templatesPath: "./src/templates", 
  sizes: [168, 32, 24]
}
```

## Library methods

### Avatar.upload
----
  Uploads the avatar images to the server in sizes `168x168`, `32x32` and `24x24` (can be changed in config).

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
    Coordinates: { width: 300, height: 300, left: 60, top: 60 },
    File: "data:image/jpeg;base64,/9j/4AAAABBGQ...",
  },
});

```



### Avatar.generate
----
  Generates the avatar images to the server in sizes `168x168`, `32x32` and `24x24` (can be changed in config) using the template and color given in the request body.

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
avatar.generate({
  AvatarAccountID: 21,
  AvatarID: 2,
  AvatarData: { TemplateID: 1, Hex: "#640a82" },
});
```
