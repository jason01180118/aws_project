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
## 安裝套件
```
pip install -r requirements.txt 
python application.py
 ```
 ## 把pip內容print出並加到requirements.txt 
 ```
 pip freeze
 pip freeze > requirements.txt
 ```
