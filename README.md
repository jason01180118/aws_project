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
