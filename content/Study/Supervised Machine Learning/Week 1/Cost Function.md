---
title: Cost Function
tags:
  - study
  - coursera-sml
draft:
---
>[!example] [[Linear Regression Models|<- Previous Lesson]] | [[Supervised Machine Learning|Home]] | [[Gradient Descent|Next Lesson ->]]

The **cost function** tells us **how well the model is doing** so we can try to improve it.

**Model**: $f_{w,b} (x) = wx + b$

This is our training set for the model ($f_{w,b} (x) = wx + b$) :
![[Pasted image 20251205171444.png|400]]

$w, b$ : **parameters** (also referred to as **coefficients** / **weights**)

Parameters are the variables you can adjust during training to improve the model. Depending on the values you chose for $w, b$, you'll get a different function $f(x)$ 

Let's graph different values for $f(x)$ based on $w, b$
![[Pasted image 20251205172213.png|700]]
You can intuit that w dictates the slope of f(x)

You want to find correct values for $w, b$ so that $f_{w,b}$ matches your training set. 
![[Pasted image 20251205172436.png|400]]

$x^{(i)}, y^{(i)}$ is a training example. y is the target

![[Pasted image 20251211172620.png|600]]
The **Squared Error Cost Function** is one type of many cost functions that machine learning engineers could use depending on the model they are building. It is also the most commonly used Cost Function, especially for [[Linear Regression Models]]. 

To build a cost function that doesn't get too large based on the number of training examples $(m)$ we compute the **average** squared error instead of **total** squared error by dividing by $1/2m$ 

You can also write the cost function like this:
![[Pasted image 20251211174124.png|500]]

We can replace the prediction $\hat{y}^{(i)}$ with $f_{w,b} (x^{(i)})$ 

>[!question]- ![[Pasted image 20251211174716.png|600]]
> **Answer**: $w$ and $b$ are parameters of the model, adjusted as the model learns from the data. They’re also referred to as “coefficients” or “weights”


>[!example] [[Linear Regression Models|<- Previous Lesson]] | [[Supervised Machine Learning|Home]] | [[Gradient Descent|Next Lesson ->]]

