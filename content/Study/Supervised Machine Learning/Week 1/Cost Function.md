---
title: Cost Function
tags:
  - study
  - coursera-sml
draft:
---
>[!example] [[Linear Regression Models|<- Previous Lesson]] | [[Supervised Machine Learning|Home]]

The **cost function** tells us **how well the model is doing** so we can try to improve it.

Model: $f_{w,b} (x) = wx + b$
$w, b$ : **parameters** (also referred to as **coefficients** / **weights**)

This is our training set for the model ($f_{w,b} (x) = wx + b$) :
![[Pasted image 20251205171444.png|400]]

Let's graph different values for $f(x)$ based on $w, b$
![[Pasted image 20251205172213.png|700]]
You can intuit that w dictates the slope of f(x)

You want to find correct values for $w, b$ so that $f_{w,b}$ matches your training set. 
![[Pasted image 20251205172436.png|400]]

x^(i), y^(i) is a training example. y is the target

![[Pasted image 20251211172620.png|600]]
The squared error cost function is one type of many cost functions that machine learning engineers could use depending on the model they are building.

It is also the most widely used Cost Function, especially for [[Linear Regression Models]]


>[!example] [[Linear Regression Models|<- Previous Lesson]] | [[Supervised Machine Learning|Home]]

