function reset(selector){
    selector = selector || '.textareas';
    $(selector)
        .html('<input type="text" name="inpname" class="somecss" />');
};

test("Create the textarea", function(){
    reset();
    
    var $t = $('.textareas input[type="text"]'),
    name = $t.attr('name'),
    class_ = $t.attr('class');
    
    $t.automultiline();
    
    ok($('.textareas *').length == 2);
    ok($('.textareas div').length == 1);
    ok($('.textareas input').length == 0);
    ok($('.textareas textarea').length == 1);
});

test("Preserve name and CSS classes", function(){
    reset();
    
    var $t = $('.textareas input[type="text"]'),
        name = $t.attr('name'),
        class_ = $t.attr('class');
    
    $t.automultiline();
    
    $txt = $('.textareas textarea');
    
    ok(new RegExp(name).test($txt.attr('name')));
    ok(new RegExp(class_).test($txt.attr('class')));
});

test("Add CSS class", function(){
    reset();
    
    $('.textareas input[type="text"]')
        .addClass('old_class')
        .automultiline({cssClass:'some_class'});
    
    ok(/some_class/.test( $('.textareas textarea').attr('class')), $('.textareas textarea').attr('class'));
    ok(/old_class/.test( $('.textareas textarea').attr('class')));
});

test("Stretch the textarea vertically", function(){
    reset();
    
    var h = function(){return $('.textareas textarea').height();},
        initialH = h(),
        maximum = 100;
    
    $('.textareas input').automultiline({maxHeight:maximum});
    
    $('.textareas textarea')
        .val('sad uhykkh asdfgjh yggugghjjg hhgjhgv' +
        'dfygyguiguy gyug iguygiu uygug uigiug yuiu' +
        'dfygyguiguy gyug iguygiu uygug uigiug yuiu' +
        'dfygyguiguy gyug iguygiu uygug uigiug yuiu')
        .change();
    
    ok(h() > initialH, "Height of textarea will grow");
    
    $('.textareas textarea')
        .val('sad uhykkh asdfgjh yggugghjjg hhgjhgv' +
        'dfygyguiguy gyug iguygiu uygug uigiug yuiu' +
        'dfygyguiguy gyug iguygiu uygug uigiug yuiu')
        .change();
    
    
    ok(h() <= maximum, 'Height of textarea stays under maximum');
});

test("Two textareas in the same div", function(){
    reset();
    
    var textareas = $('.textareas')
        .html('<input/><input/>');
    
    textareas.find('*').automultiline();
    
    ok($('.textareas *').length == 4);
    ok($('.textareas div').length == 2);
    ok($('.textareas input').length == 0);
    ok($('.textareas textarea').length == 2);
});

test("Enter is forbidden", function () {
    reset();
    $('.textareas input')
        .automultiline();
    var txt = $('.textareas textarea');
    txt.val('sth');
    equal(txt.val(), 'sth', 'Initial value');
    e = jQuery.Event('input');
    e.which = 65;
    txt.bind('input', function (e) { console.log(e)})
        .trigger(e);
    equal(txt.val(), 'sthA', 'injecting event with key');
    e = jQuery.Event('keydown');
    e.which = 13;
    txt.trigger(e);
    equal(txt.val(), 'sthA', 'injecting event with forbidden ENTER key');
    
    reset();
    
    $('.textareas input')
        .automultiline({allowNewline:true});
    
    var txt = $('.textareas textarea');
    
    txt.val('sth');
    equal(txt.val(), 'sth', 'txt.val("sth"). Sanity check.');
    
    e = jQuery.Event('keydown');
    e2 = jQuery.Event('keyup');
    e.which = e2.which = 65;
    txt.trigger(e);
    txt.trigger(e2);
    equal(txt.val(), 'sthA', 'Inserting Capital A');
    
    e = jQuery.Event('keydown');
    e.which = 13;
    txt.trigger(e);
    equal(txt.val(), 'sthA\n', 'Inserting ENTER key, which should now work.');
});

