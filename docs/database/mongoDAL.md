# Mongo DAL Class

bu sinifin kullanim amaci veritabanina en kolay sekide yonetmek.

## Yazim bilgisi

- Lint: Eslint Airbnb.
- Case: degiskenler ve parametreler camel case. Class, method, fonksiyonlar pascal case.

## Not

yapilacak degisiklik: Class abstrack class olmayacak.  
Veri tabani tasarimi daha bitmedi burasi degise bilir.

## Fonksiyonlar

- OpenConnection()
- Close()
- SortQuery() // test edilmedi
- MonogoQueryFromSingleQuery({colonOfTable,query,mustBeData})
- PrepareQuery(queryArr)
- MerageQuery(query)
- MongoQueryFromQueryStringObjs(queryArr)
- PrepareQueryForFiltering(sort,queryArr)
- IdsToString(cursorArr)
- Filter({table,queryArr,limit=50,index=0,sort=[{ orderBy: 'rank', sortBy: 'asc' }] })
- WriteDAtaToDB({table,data,id})
- DelById({table,id})
- SetUpdateData(data)
- UpdateById({table,id,data})
- GetById({table,id})
- IncrementData(colon,inc)
- PushData(colon,data,table,id)
- PullData(colon,data,table,id)

## Fonksiyon Aciklamalari

### OpenConnection()

Veritabain baglantisini olusturur.
`this.db` degikenine MongoClinet() nesnesi olusturulur ve baglanir.
Class basaltilirken verilen name parametresi ile mongodaki veritabanina baglanip `this.database` degiskenine atanir.

### Close

Acik veri tabani baglantisini kapatir.
`this.db`'yi kapatir.

### ShortQuery(sort)

<small> test edilmedi. tahminen uzun listelerde hatali.</small><br>
<small>_sort = [{orderBy:"kolon_adi",sortBy:"asc"|"desc"}]_</small><br>
<small> return: [{"kolon_adi":"asc"|desc}]</small><br>
"asc","desc" gibi sort bilgiisin alir ve mongo icin degistiri ve return eder.

| kelime | cevrilen |
| :----- | :------- |
| asc    | 1        |
| desc   | -1       |

### MongoQueryFromSingleQuery({colonOftable,query,mustBeData})

<small>isimli parametre
{colonOftable:"age",query:"<=",mustBeData:"18"}
| parametre |veri|
|:-|:-|
|colonOfTable|"tablo_adi"|
|query |"<" , "<=" , "==" , ">" ,">="|
|mustBeData |olmasi_gereken_veri|

return {"name":{$lte:"18"}}
</small>
json querisini mongo queriy turune cevirip return eder.

### PrepareQuery(queryArr)

listenin bos olup oladigini kontrol eder.
query listesini mongo query listesi haline cevirir ver geri dondurur.

### MergeQuery(query)

<small>query=[{name:"efe"},{old:{$lt:18}}]<br>
return: {name:"efe",old:{$lt:18}}<br></small>
prepareQuery json query leri liste olarak doner.
merge query liste halinde olan querlieri tek json da birlestirir.

### MongoQueryFromQueryStringObjs(queryArr)

query listesini mongo querysine cevirir ve geri dondurur.
PrepareQuery,MergeQuery methodlari bu method icin yazildi.

### PrepareQueryForFiltering(sort,queryArr)

Query listesini ve sort listesini mongonun alyacagi hale ceviri.
Liste dondurur ilk eleman query objesi ikinci sort objesidir.

### IdsToString(cursorArr)

Mongo cursor'unu parametre olarak alir.
Cursor verisinde donerek butun OjectId nesnelrini string'e cevirir ve donurur.

### Filter({table,queryArr,limit=50,index=0,sort=[{ orderBy: 'rank', sortBy: 'asc' }] })

Mongo db den sorgu atmaya saglar.
Sort quersini ve fileter querilerini mongoa uyarlar.
Veritabani Baglantisini acar.
Tabloyu secer.
Mongo'ya sorguyu atar cevabi listeye cevirir.
Idleri stringe cevirir ver return eder.

### WriteDataToDB({table,data,id})

Mongo db ye veri yazmayi saglar
Id parametresinde ki veri mongo oject id standartlarina uygun olmali yoksa Hataverir.
Baglanti acar.
Tablo secer.
Id paramteresi dolumu diye bakar.
Verileri db ye yazar.
Boolean veri dondurur basrili ise true.

### DelaById({table,id})

Tablo ve id parameterelerini alir ve siler eger silerse true dondurur.

### SetUpdateData(data)

Update verisis {$set:{a:10}} gibi olmali.
veriyi olmasi gerektigi gibi set objesinin icine koyar ve dondurur.

### UpdateById({table,id,data})

data parametresini isleyerek update hazir hale getirir.
islemins datayi yani update'i veritabanina yazar.
basarili ise true doner degilse `no data` hatasi verir

### GetById({table,id})

secilen tablodaki istnilen id deki veriyi doner.
return tipi json objesidir liste degildir .

### IncreementData(colon, inc)

secilen colona veri atrtima yada azaltma ojesine cevirir ve return eder.
soncu update'ye verilmeli.

### PushData(colon, data,table,id)

obje icindeki listeye veri ekler.

### PullData(colon, data,table,id)

obje icindeki listedeki siler.
