# After-Effects-Precomp-by-Prefix

This is a script intended to be used for Adobe After Effects (AE)

---

## What it does:
Takes an AE composition with many layers and breaks it down into compositions and subcompositions based on layer naming. 
E.g. layers named in this way:
```
comp1/text01
comp1/text02
comp2/text01
```
...will be reordered into compositions like this:
```
comp1
  L text01
  L text02
comp2
  L text01
```
This script was specifically created for use when bringing in Adobe Illustrator files into After Effects since there is no supported way to have after effects interpret Illustrator layer grouping into compositions.

## Usage
- Download the .jsx file
- Navigate to `C:\Users\ehall\AppData\Roaming\Adobe\After Effects\[version]`
- Create the following folders: `\Scripts\ScriptUI Panels`
- Place `PrecompByPrefix.jsx` into the `ScriptUI Panels` folder.
- In After Effects open `Edit > Preferences > Scripting & Expressions`
  - Make sure "Allow Scripts to Write Files and Access Network" is checked 
- Restart After Effects
- Import your layers and open the composition that holds them all
- Navigate to `Window > PrecompByPrefix.jsx`
  - This will open the PrecompByPrefix window. It can be docked anywhere you like if you want to keep it as part of your layout
  - Clicking the `Create Nested Comps` button will execute the script

Options: 
- `Separate comps by: ` this option allows you to define what separator you are using in your layer naming.
  - E.g. if you'd rather name your layers "comp1_text01, comp1_text02" simply change the separator in the script from "/" to "_".
  - The only requirement is that all your layers you want nesting to apply to must use the same separator.

