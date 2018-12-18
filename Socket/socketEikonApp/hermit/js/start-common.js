
$(function(){
    let round = localStorage.getItem('round');
    $('body').prepend(`<div class="introduct mark">
    <p class="title">ROUND ${round}</p>
    <p class="introduct-text">${description}</p>
    <p class="ready color-text">READY?</p>
    <p class="go">GO</p>
</div>`)
})
function beginAnimate(){    

    $(".ready").css({"display": "block"}).addClass("animated bounceIn");
    setTimeout(function(){
        $(".go").css({"display": "block"}).addClass("animated bounce");
        
        setTimeout(function(){
            $(".introduct").addClass("animated rollOut");
            // beginGame();
        }, 2000);
    }, 3000);    
}

function finishGameAnimate(result){
    let className = result=='win'?'win':'gameover'
    let msg = result=='win'?'You Win!':'Game Over'
    $('body').prepend(`<div class="result-mark mark">
    <p class="${className} color-text">${msg}</p>
</div>`)
    $(".result-mark").css({"display": "grid"}).addClass("animated rollIn");
    let pageUrl = ['sort-puzzle.html','quick-answer.html','ending.html',]
    setTimeout(function(){
        // let user = localStorage.getItem('user')
        // let round = localStorage.getItem('round')
        // if(user.symbol === 'symbol1'){
        //     socket.emit('temp leave',{
        //         uuid:user.uuid
        //     })
        // }
        
        // socket.on('temp leave',(data) => {
        //     let leaveID = data.leaveID
        //     localStorage.setItem('leaveID',leaveID)
        //     window.location.href = 'round-end.html' ;
        // })
        window.location.href = 'round-end.html' ;
    }, 3000);
}