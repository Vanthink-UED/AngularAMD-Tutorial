

App.LoadingSpinner.show('.js-rank-list');

App.send('getRankingList',{
    data:{
        'testbank_no' : $('.js-testbank-no').val(),
        'gmno' : 2
    },
    success: function(result){
        if(result.errcode == 0){
            App.LoadingSpinner.hide();

            App.Template.render('rank-list',{data:result.data});
        }else{
            App.sendMessage(result.errstr);
            App.Template.render('rank-list',{data:[]});
        }
    }
});





    
