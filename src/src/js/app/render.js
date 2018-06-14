define(['jquery','handlebars'],function($,hand){
    function render(data,source,targe){
        var soure=source.html();
        var template=hand.compile(soure);
        var html=template(data);
        targe.append(html);
    }
    return render;
})