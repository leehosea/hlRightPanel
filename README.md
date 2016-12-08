# HL Right Panel

This is a simple, small jQuery plugin for generate a tab/panel on right of page

## Usage

### 1.Clone this project to local

```
git clone https://github.com/leehosea/hlRightPanel.git
```

### 2.Use it in your project

You will see something like this:


```
hlRightPanel/
├── package.json
├── gulpfile.js
├── README.md
├── example/
│   └── index.html
└── src/
    ├── hlRightPanel.css
    └── hlRightPanel.js
```

If you want to use hlRightPanel in your project, just copy all files in folder 'src' to anywhere you want of your project.
Then import css and js files to your html after jquery, like this:

```
<!--load jquery-->
<script src="../plugins/jquery/jquery.min.js" type="text/javascript"></script>

<!--load hlRightPanel-->
<link href="../src/hlRightPanel.css" rel="stylesheet">
<script src="../src/hlRightPanel.js" type="text/javascript"></script>
```

Upon that, you can generate a tab/panel with jQuery in your page. The detail please see example.

### 3.Example

In folder 'example', you can find a index.html. Open it in browser, you can see a simple example.
But before it you have to prepare something for it, like this:

```
npm install
```

Upon that, you will see two folders in hlRightPanel, one is 'node_modules', the other is 'plugins'.
If success, see example in browser.