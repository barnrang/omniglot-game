# Omniglot matching game
A simple matching game on omniglot dataset, trained based on this paper https://www.cs.cmu.edu/~rsalakhu/papers/oneshot1.pdf

![](demo.gif)

## Requirement
1. npm http-server https://www.npmjs.com/package/http-server

## model download
https://drive.google.com/drive/folders/1UMU6wQSWanWVq8wnNPdyb9JLR-zJFMDy?usp=sharing

download and put 2 folders into a folder named `models` (`mkdir models` in the root of the project)

## Data setup
Extract `test.zip` in `data` folder. that's all

## Run the game
```
$> cd <navigate to project folder>
$> http-server .
```

Access `127.0.0.1:<port>/index`
