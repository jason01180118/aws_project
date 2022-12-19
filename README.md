# aws_project
 ## 創建虛擬環境
```
virtualenv virt 
```
 ## 允許腳本運行(powershell)
 ```
Set-ExecutionPolicy Unrestricted -Scope Process
.\virt\Scripts\activate.ps1
```
## 安裝套件(會看到(virt)在前面)
```
pip install -r requirements.txt 
python application.py
 ```
 ## 把pip內容print出並加到requirements.txt 
 ```
 pip freeze
 pip freeze > requirements.txt
 ```
# demo前置設定

```
進入chrome後前往這個頁面chrome://flags/#unsafely-treat-insecure-origin-as-secure(在網址列輸入)
在框框內填入http://flasktutorial-env-1.eba-ypmnuwvp.us-east-1.elasticbeanstalk.com/
然後旁邊Disabled改成Enabled
然後relaunch(chrome的那個relaunch按鈕有可能沒用，要手動重開chrome)
```
重開完之後確認框框內有網址前置設定就完成囉
可以點網址前往試用：http://flasktutorial-env-1.eba-ypmnuwvp.us-east-1.elasticbeanstalk.com/
# elastic beanstalk設定

```
進入aws後輸入elastic beanstalk
點選create application(設定name跟python環境)
最底下記得先別點create
按Configure more options
然後調security
選labrole、vockey跟lab...
然後之後上傳打包的zip到deploy就可以了
```

# 413解決方法

先登入ec2
```
用ppk檔登入putty
user:ec2-user
```
```
cd ..
cd ..
cd etc
cd nginx
sudo nano nginx.conf
加上client_max_body_size 20M;
cd ..
cd ..
cd sbin
sudo nginx -s reload
```