let difficulty=3;//游戏难度
let image;//游戏背景图片对象
let imagePath;//游戏路径
let singleWidth;//填充小方块时图片的偏移宽度
let singleHeight;//填充小方块时图片的偏移高度
let emptyBlock;//标记空块对象
let emptyBlockId;//空块对象的id
let operateStack;//操作栈
let score=0;
/**
 * 记录每一块图像的相关位置：
 * 物理位置：图像块的实际坐标，也是“图片位置”的标准答案
 * 图片位置：实际小方块上的图像坐标
 * 该游戏X方向从左向右，Y方向从上到下，即原点位于屏幕左上角
 */
/*var time=0;
var pause=true;
var set_timer;

 */
var myVar=setInterval(function(){myTimer()},1000);
function myTimer(){
	var d=new Date();
	var t=d.toLocaleTimeString();
	document.getElementById("demo").innerHTML=t;
}
class Position{
    constructor(_x,_y){
        this.x=_x;
        this.y=_y;
    }
}
 
/**
 * 开局函数——供开局按钮调用
 */
function opening(){
    let gameRegion=document.getElementsByClassName("gameRegion")[0];
    while(gameRegion.hasChildNodes()){
        gameRegion.removeChild(gameRegion.firstChild);
    }//移除html上的已有小方块
    let positions=getOpeningPositions();//获得开局填充方块的图像坐标
    gameRegion.style.width=image.width+"px";
    gameRegion.style.height=image.height+"px";//重新设置游戏区域大小
    let rowContainer;//行容器
    let currentItem;//即将填充的小方块
    let percentage=(100.0/difficulty)+"%";
    let positionId;
    for(let y=0;y<difficulty;y++){//开始循环填充
        rowContainer=document.createElement("div");
        rowContainer.className="rowContainer";
        rowContainer.style.height=percentage;
        for(let x=0;x<difficulty;x++){
            positionId=x+y*difficulty;//计算小方块的位置id
            currentItem=document.createElement("div");
            currentItem.dataset.physicalPosition=toString(new Position(x,y));//设置物理位置id
            if(positionId!==emptyBlockId) {//如果当前小方块的位置id不等于空块的位置id，填充图案
                currentItem.dataset.imagePosition=toString(positions[positionId]);
                currentItem.style.background="url("+image.src+") "+singleWidth*positions[positionId].x
                    +"px "+singleHeight*positions[positionId].y+"px";
            }else{//否则空填充
                currentItem.dataset.imagePosition=toString(positions[positionId]);
                emptyBlock=currentItem;
            }
            currentItem.style.height="100%";
            currentItem.id="id"+positionId;
            currentItem.style.width=percentage;
            currentItem.onclick=onItemClick;
            currentItem.className="rowItemDisable";
            rowContainer.appendChild(currentItem);//基本操作
        }
        gameRegion.appendChild(rowContainer);
    }
    let enableBlocks=getAroundBlocks(emptyBlock);//得到空方块周边的方块，让它们处于激活状态
    for(let i=0;i<enableBlocks.length;i++){
        enableBlocks[i].className="rowItemActive";
    }
    let scoreElement=document.getElementById("score");
    score=0;
    scoreElement.innerHTML="当前操作次数："+score;
}
/* //定时函数，每一秒执行一次
        function timer(){
            time+=1;//一秒钟加一，单位是秒
            var min=parseInt(time/60);//把秒转换为分钟，一分钟60秒，取商就是分钟
            var sec=time%60;//取余就是秒
            document.getElementById("timer").innerHTML=min+"分"+sec+"秒";//然后把时间更新显示出来
        } 
       //开始暂停函数
        function start(){
            if(pause){
                document.getElementById("start").innerHTML="暂停";//把按钮文字设置为暂停
                pause=false;//暂停表示设置为false
                set_timer=setInterval(timer,1000);//启动定时
                //如果当前是暂停，则开始
            }else{
                document.getElementById("start").innerHTML="开始";
                pause=true;
                clearInterval(set_timer);
            }
        }
        //重置函数
        

        function reset(){
            time=0;//把时间设置为0
            random_d();//把方块随机打乱函数
            if(pause)//如果暂停，则开始计时
                start();
        }
        
 */
/**
 * 判断游戏是否结束
 * @returns {boolean} true:游戏结束；false:游戏尚未结束
 * 当所有小方块的物理位置坐标等于图像位置时游戏结束，否则游戏继续
 */
function gameOver(){
    let numbers=difficulty*difficulty;//游戏总小方块
    let checkBlock;//当前检查的方块
    let physicalPosition;
    let imagePosition;//坐标引用
    for(let i=0;i<numbers;i++){
        checkBlock=document.getElementById("id"+i);
        physicalPosition=toObject(checkBlock.dataset.physicalPosition);
        imagePosition=toObject(checkBlock.dataset.imagePosition);
        if(physicalPosition.x!==imagePosition.x||physicalPosition.y!==imagePosition.y){
            return false;
        }
    }
    return true;
}
/*试图用localstorage写历史记录 key是时间，value是score???
    function setStorage(key,value){
        if(!window.localStorage){
            alert("浏览器不支持localstorage");
            return false;
        }else{
            var storage=window.localStorage;
            //写入字段
            storage.setItem(key,value);
        }
    }
    function getStorage(key){
        if(!window.localStorage){
            alert("浏览器不支持localstorage");
        }else{
            var storage=window.localStorage;
            var key=storage.getItem(key);
//            console.log(key);
            return key;
        }
}

 */
// function fillImage(imagePosition,item){
//     let opacity = 0;
//     item.style.background="url("+image.src+") "+singleWidth*imagePosition.x+"px "+singleHeight*imagePosition.y+"px" ;
//     item.dataset.imagePosition=toString(imagePosition);
//     item.style.opacity=0;
//     let interval = setInterval(function () {
//         opacity++;
//         item.style.opacity = opacity*0.1;
//         if(opacity === 10){
//             clearInterval(interval);
//         }
//     },25);
//
// }
// function cleanImage(item){
//     let opacity = 10;
//     let interval = setInterval(function () {
//         opacity--;
//         item.style.opacity =opacity*0.1;
//         if(opacity === 0){
//             clearInterval(interval);
//             item.style.background=null;
//             item.dataset.imagePosition=emptyBlock.dataset.imagePosition;
//         }
//     },25);
// }
/**
 * 该函数将实现图片方块和空方块的交换，包括图片交换和imagePosition数据交换以及周边“激活”块
 * @param item 将要和空块进行交换的小方块
 */
function doExchange(item){
    let imagePosition=toObject(item.dataset.imagePosition);//得到item的图片位置
    let emptyImagePosition=emptyBlock.dataset.imagePosition;//得到空块的图片位置
    emptyBlock.dataset.imagePosition=item.dataset.imagePosition;//修改空块的图片位置
    item.dataset.imagePosition=emptyImagePosition;//修改item的图片位置
    emptyBlock.style.background="url("+image.src+") "+singleWidth*imagePosition.x+"px "+singleHeight*imagePosition.y+"px" ;
    item.style.background=null;//填充图像
    let disableBlocks=getAroundBlocks(emptyBlock);
    for(let i=0;i<disableBlocks.length;i++){
        disableBlocks[i].className="rowItemDisable";
    }
    emptyBlock=item;//恢复处于“激活”状态的小块
    let enableBlocks=getAroundBlocks(emptyBlock);
    for(let i=0;i<enableBlocks.length;i++){
        enableBlocks[i].className="rowItemEnable";
    }//展示新的激活状态
    let scoreElement=document.getElementById("score");
    score+=1;
    scoreElement.innerHTML="当前操作次数："+score;
    setTimeout(function(){ 
		if(gameOver()){//检查游戏是否结束
        	alert("恭喜你，拼图成功啦！接下来挑战更高难度吧:-)（确定后可后悔");
        	difficulty=(difficulty+1)%3+3;
        	singleHeight=-1*image.height/difficulty;
        	singleWidth=-1*image.width/difficulty;
        	opening();
        }
	},1000); 
    // //第二版
    // let imagePosition=toObject(item.dataset.imagePosition);
    // let emptyImagePosition=emptyBlock.dataset.imagePosition;
    // emptyBlock.style.background="url("+image.src+") "+singleWidth*imagePosition.x+"px "+singleHeight*imagePosition.y+"px" ;
    // emptyBlock.dataset.imagePosition=toString(imagePosition);
    // // emptyBlock.style.opacity=0;
    // let emptyOpacity = 0;
    // let emptyInterval = setInterval(function () {
    //     emptyOpacity++;
    //     emptyBlock.style.opacity = emptyOpacity*0.1;
    //     if(emptyOpacity === 10){
    //         clearInterval(emptyInterval);
    //     }
    // },25);
    // let itemOpacity = 10;
    // item.dataset.imagePosition=emptyImagePosition;
    // let itemInterval = setInterval(function () {
    //     itemOpacity--;
    //     item.style.opacity =itemOpacity*0.1;
    //     if(itemOpacity === 0){
    //         item.style.background=null;
    //         emptyBlock=item;
    //         if(gameOver()){
    //             alert("恭喜你，完成任务！接下来挑战更高难度吧:-)");
    //         }
    //         clearInterval(itemInterval);
    //     }
    // },25);
 
    // //第一版
    // fillImage(imagePositionTemp,emptyBlock);
    // let disableBlocks=getAroundBlocks(emptyBlock);
    // for(let i=0;i<disableBlocks.length;i++){
    //     disableBlocks[i].className="rowItem";
    // }
    // cleanImage(item);
    // emptyBlock=item;
    // let enableBlocks=getAroundBlocks(emptyBlock);
    // for(let i=0;i<enableBlocks.length;i++){
    //     enableBlocks[i].className="rowItemActive";
    // }
}
 
/**
 *
 * @param centerBlock 处于中心的小方块
 * @returns {Array} 中心小方块周围的小方块
 */
function getAroundBlocks(centerBlock){
    let centerPosition=toObject(centerBlock.dataset.physicalPosition);
    let targetBlock;
    let blocks=[];
    //检查上下左右是否在界内；
    if(centerPosition.x-1>=0){//左边
        targetBlock=document.getElementById("id"+(centerPosition.x-1+centerPosition.y*difficulty));
        blocks.push(targetBlock);
    }
    if(centerPosition.x+1<difficulty){//右边
        targetBlock=document.getElementById("id"+(centerPosition.x+1+centerPosition.y*difficulty));
        blocks.push(targetBlock);
    }
    if(centerPosition.y+1<difficulty){//下边
        targetBlock=document.getElementById("id"+(centerPosition.x+(centerPosition.y+1)*difficulty));
        blocks.push(targetBlock);
    }
    if(centerPosition.y-1>=0){//上边
        targetBlock=document.getElementById("id"+(centerPosition.x+(centerPosition.y-1)*difficulty));
        blocks.push(targetBlock);
    }
    return blocks;
}
 
/**
 * 选择游戏难度：3*3、4*4、5*5
 * @param difficultyNum
 */
function onChooseDifficulty(difficultyNum){
    difficulty=difficultyNum;
    image=new Image();
    image.src=imagePath;
    image.onload=function() {
        singleWidth=-1*image.width/difficulty;
        singleHeight=-1*image.height/difficulty;
        opening();
    }
}
 
/**
 * 选择游戏图片
 * @param imageNum 游戏图片代码
 */
function onChooseImage(imageNum){
    image=new Image();
    switch(imageNum){
        case 0:
            imagePath="./img/duck.jpg";
            break;
        case 1:
            imagePath="./img/guowang.jpg";
            break;
        case 2:
            imagePath="./img/long.jpg";
            break;
        case 3:
            imagePath="./img/rocket.jpg";
            break;
        case 4:
            imagePath="./img/ll.jpeg";
            break;
    }
    let tipImg=document.getElementById("tipImg");
    image.src=imagePath;
    tipImg.src=image.src;
    image.onload=function() {
        singleWidth=-1*image.width/difficulty;
        singleHeight=-1*image.height/difficulty;
        opening();
    }
}
 
/**
 * 小方块的点击函数
 */
function onItemClick(){
    let item=this;
    let itemPosition=toObject(item.dataset.physicalPosition);
    //判断是否可以移动，如果可以移动，把反操作压入栈
    if(isOnEmptyLeft(itemPosition)){
        operateStack.push(emptyMoveRight);
    }else if(isOnEmptyUp(itemPosition)){
        operateStack.push(emptyMoveDown);
    }else if(isOnEmptyRight(itemPosition)){
        operateStack.push(emptyMoveLeft);
    }else if(isOnEmptyDown(itemPosition)){
        operateStack.push(emptyMoveUp);
    }else{
        return;
    }
    doExchange(item);//移动就好
}
 
/**
 * 提示的点击函数，从操作栈里弹出一个函数，然后调用即可复原
 */
function onTips(){
    let doFunction=operateStack.pop();
    if(doFunction){
        doFunction();
    }//实际上，操作栈为空的时候，游戏也就结束了
}
 
/**
 * 该函数起到洗牌操作，但是不展示“特效”，仅仅在数据上实现洗牌；
 * 该洗牌算法保证了游戏一定有解，但是比较愚蠢，有可能左移晚就右移，实际上也应该可以处理
 * 但是由于尚未实现
 * @returns {Array}图片位置信息数组
 */
function getOpeningPositions(){
    let positions=[];
    operateStack=[];
    for(let y=0;y<difficulty;y++){
        for(let x=0;x<difficulty;x++){
            positions[y*difficulty+x]=new Position(x,y);
        }
    }//完成顺序填充
    let currentEmptyX=difficulty-1;
    let currentEmptyY=difficulty-1;//记录空块位置信息
    let emptyPositionId=currentEmptyX+currentEmptyY*difficulty;
    let moveNum=5*difficulty;//生成移动次数
    let tempPosition;
    let targetPositionId;
    let directionNum;
    let doExchange=false;//是否需要执行交换
    for(let i=0;i<moveNum;i++){
        directionNum=Math.floor(Math.random()*4+1);//产生随机方向数，上下左右四个
        //检查是否可以移动
        switch(directionNum){
            case 1://上
                if(currentEmptyY-1>=0){
                    currentEmptyY--;
                    operateStack.push(emptyMoveDown);
                    doExchange=true;
                }else{
                    doExchange=false;
                }
                break;
            case 2://下
                if(currentEmptyY+1<difficulty){
                    currentEmptyY++;
                    operateStack.push(emptyMoveUp);
                    doExchange=true;
                }else{
                    doExchange=false;
                }
                break;
            case 3://左
                if(currentEmptyX-1>=0){
                    currentEmptyX--;
                    operateStack.push(emptyMoveRight);
                    doExchange=true;
                }else{
                    doExchange=false;
                }
                break;
            case 4://右
                if(currentEmptyX+1<difficulty){
                    currentEmptyX++;
                    operateStack.push(emptyMoveLeft);
                    doExchange=true;
                }else{
                    doExchange=false;
                }
                break;
        }
        if(doExchange){//执行交换
            targetPositionId=currentEmptyX+currentEmptyY*difficulty;
            tempPosition=positions[targetPositionId];
            positions[targetPositionId]=positions[emptyPositionId];
            positions[emptyPositionId]=tempPosition;
            emptyPositionId=targetPositionId;
        }
    }
    emptyBlockId=emptyPositionId;//记录空块id
    return positions;
}
 
/**
 * 以下函数为键盘操作提供支持
 */
function emptyMoveLeft(){
    let emptyPositionObj=toObject(emptyBlock.dataset.physicalPosition);
    let operateBlock=document.getElementById("id"+((emptyPositionObj.x-1)+(emptyPositionObj.y*difficulty)));
    doExchange(operateBlock);
}
function emptyMoveRight(){
    let emptyPositionObj=toObject(emptyBlock.dataset.physicalPosition);
    let operateBlock=document.getElementById("id"+((emptyPositionObj.x+1)+(emptyPositionObj.y*difficulty)));
    doExchange(operateBlock);
}
function emptyMoveUp(){
    let emptyPositionObj=toObject(emptyBlock.dataset.physicalPosition);
    let operateBlock=document.getElementById("id"+(emptyPositionObj.x+(emptyPositionObj.y-1)*difficulty));
    doExchange(operateBlock);
}
function emptyMoveDown(){
    let emptyPositionObj=toObject(emptyBlock.dataset.physicalPosition);
    let operateBlock=document.getElementById("id"+(emptyPositionObj.x+(emptyPositionObj.y+1)*difficulty));
    doExchange(operateBlock);
}
 
function onKeyDown(event){
    let emptyPosition=toObject(emptyBlock.dataset.physicalPosition);
    if(event && event.keyCode===37){ // 按 左移
        if(emptyPosition.x+1<difficulty){
            emptyMoveRight();
            operateStack.push(emptyMoveLeft);
        }else{
            alert("不能左移！");
        }
    }
    if(event && event.keyCode===38){ // 按 上移
        if(emptyPosition.y+1<difficulty){
            emptyMoveDown();
            operateStack.push(emptyMoveUp);
        }else{
            alert("不能上移");
        }
    }
    if(event && event.keyCode===39){ // 按 右移
        if(emptyPosition.x-1>=0){
            emptyMoveLeft();
            operateStack.push(emptyMoveRight);
        }else{
            alert("不能右移");
        }
    }
    if(event && event.keyCode ===40){// 按 下移
        if(emptyPosition.y-1>=0){
            emptyMoveUp();
            operateStack.push(emptyMoveDown);
        }else{
            alert("不能下移");
        }
    }
}
/**
 * 以下函数为触发点击事件时判断是否可以移动提供支持
 * @param itemPosition item的物理位置
 * @returns {boolean}
 */
function isOnEmptyLeft(itemPosition){
    let emptyPosition=toObject(emptyBlock.dataset.physicalPosition);
    return itemPosition.y===emptyPosition.y&&itemPosition.x+1===emptyPosition.x;
}
function isOnEmptyRight(itemPosition){
    let emptyPosition=toObject(emptyBlock.dataset.physicalPosition);
    return itemPosition.y===emptyPosition.y&&itemPosition.x-1===emptyPosition.x;
}
function isOnEmptyUp(itemPosition){
    let emptyPosition=toObject(emptyBlock.dataset.physicalPosition);
    return itemPosition.x===emptyPosition.x&&itemPosition.y+1===emptyPosition.y
}
function isOnEmptyDown(itemPosition){
    let emptyPosition=toObject(emptyBlock.dataset.physicalPosition);
    return itemPosition.x===emptyPosition.x&&itemPosition.y-1===emptyPosition.y
}
 
/**
 * 将positionObj转化为JSON字符串
 * @param positionObj
 */
function toString(positionObj){
    return JSON.stringify(positionObj);
}
 
/**
 * 将JSON字符串转换为Position对象
 * @param positionString
 */
function toObject(positionString){
    return JSON.parse(positionString);
}