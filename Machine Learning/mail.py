import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
mail_dataset=pd.read_csv("mail_data.csv")
print(mail_dataset.head())
main_dataset=mail_dataset.where((pd.notnull(mail_dataset)),'')
print(main_dataset.head())
print(main_dataset.shape)
#LABEL ENCODING
#let spam mails =0, ham mails=1
main_dataset.loc[main_dataset['Category']=='spam','category,']=0
main_dataset.loc[main_dataset['Category']=='ham','category,']=1

#Seperating the text data and label data
X=main_dataset['Message']
Y=main_dataset['Category']
print(X)
print(Y)

#train_test_split
X_train,X_test,Y_train,Y_test=train_test_split(X,Y,train_size=0.2,stratify=Y,random_state=3)
print(X.shape,X_train.shape,X_test.shape)

#Converting text data into featured vectors i.e., numbers
fe=TfidfVectorizer(min_df=1,stop_words='english',lowercase=True)
X_train_features=fe.fit_transform(X_train)
X_test_features=fe.transform(X_test)

#Logistic Regression Model
model=LogisticRegression()
model.fit(X_train_features,Y_train)
pred=model.predict(X_train_features)
acc=accuracy_score(pred,Y_train)
print(acc)

input_data=["Go until jurong point, crazy.. Available only in bugis n great world la e buffet... Cine there got amore wat..."]
inpu_data=fe.transform(input_data)
predic=model.predict(inpu_data)
print(predic)
if(predic[0]=='ham'):
    print("It is Ham Mail...")
elif(predic[0]=='spam'):
    print("It is Spam Mail...")
