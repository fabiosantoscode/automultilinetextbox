(function($){
    var defaultOptions = {
            /* Maximum height the input can have before it vertically stretches
            itself. In pixels.
            The default allows for a maximum of 3 lines in a normal setting. */
            maxHeight:57,
            /* Allow for newline characters to be inserted */
            allowNewline:false,
            /* Add a class to the textarea. Note: classes from the original text
            box are preserved. */
            cssClass:'automultiline-textarea',
            /* (advanced) () Widget width. Undefined => original input width. */
            width:undefined,
            /* (advanced) (4-20) Add characters to the invisible DIV to get the
            textarea to resize earlier than actually necessary. */
            addCharacters:10,
            /* (advanced) ('none'|'vertical') Allow users to resize the text
            box. (horizontal|both) allowed too.*/
            resize:'none',
            /* (advanced) (0-10) Width of the left and right margin, padding and
            border of the input. */
            padding:3
        },
        enterKeyCode = 13;
    $.fn.automultiline = function(userOptions){
        /* turns undefined into {} and keeps all object keys intact if options
        is an object. */
        var options = $.extend({}, userOptions);
        $.extend({}, defaultOptions);
        console.log(options);
        /* Fun hack 1: Creating a string of repeated x's by converting powers
        of ten to string and using replace to replace the zeroes which have the
        count we need. Still trying to figure out how to deal with the
        automatic scientific notation. */
        var addChars = new String(Math.pow(10, options.addCharacters)).replace(
            /1?0/g, 'x');
        
        return (this).each(function(){
            /* Readability trick: I found this one out by reading the
            jQuery-powered JS code behind xkcd 1110 (by ProPuke). Since $ can
            be used in identifier names, and it's intuitively known to be
            directly related to jQuery. $SomeDiv simply reads better than
            $('.somediv'), is more DRY, and can later be optimized by minifiers.
            
            xkcd.com/1110 is an awesome experience, and the code behind it is
            very interesting. Check both out. Don't forget to click and drag. */
            var $OriginalInput = $(this)
                /* no effect when options.width === undefined */
                .width(options.width),
                originalInputWidth = $OriginalInput.innerWidth(),
                $Textarea = $('<textarea/>')
                    .attr('class', $OriginalInput.attr('class'))
                    .attr('name', $OriginalInput.attr('name'))
                    .addClass(options.cssClass)
                    .css({resize : options.resize})
                    .insertBefore($(this))
                    .val($OriginalInput.val()),
                $SizeDiv = $('<div/>')
                    .css({
                        visibility:'hidden',
                        position:'absolute',
                        height:'auto',
                        /* this gets options.width if it is defined, or
                        the original text input width if options.width
                        was undefined. */
                        width:$OriginalInput.width(), 
                        'word-wrap':'break-word',
                        'min-height':$OriginalInput.height(),
                        width:$OriginalInput.width() - (options.padding * 2)
                    })
                    .insertBefore($(this));
            console.log(options.cssClass);
            var updatetext = function(){
                /* Update hidden size div. */
                var newtext = $(this).val()
                    .replace(/  /gm, ' &nbsp;')
                    .replace(/\n/gm, '<br/>')
                    + addChars,
                    height;
                
                $SizeDiv
                    .html(newtext)
                    .width($SizeDiv.width());
                
                /* Update textarea size */
                height = $SizeDiv.height();
                
                if (height < options.maxHeight
                        || options.maxHeight === undefined)
                    $Textarea
                        .height(height);
                $Textarea
                    .width($SizeDiv.width());
            };
            $Textarea
                .keydown(options.allowNewline ? null : function(e){
                    if (e.which === enterKeyCode){
                        $(this)
                            .parents('form')
                            .eq(0)
                            .submit();
                        e.preventDefault();
                    }
                })
                .keyup(options.allowNewline ? null : function(e){
                    if (e.which === enterKeyCode){
                        //return false;
                    }
                })
                // Executed after the above one
                .keyup(updatetext)
                .change(updatetext)
                .change();
            /* Instant jQuery plugin. Add functionality to the current jQuery
            chain, but not to other jQuery chains. It works because every JQ
            function returns a reference to the same object, with new
            properties when required. This technique might become broken in
            future jQuery versions. */
            $.extend( $Textarea.add($SizeDiv) , {
                    'ATTR' : function(attr){
                        return this
                            .attr(attr, $OriginalInput.attr(attr));
                    },
                    'CSS' : function(prop){
                        return this
                            .css(prop, $OriginalInput.css(prop));
                    }
                })
                .CSS('font-family')
                .CSS('font-size')
                .CSS('font-weight')
                //.ATTR('class')
                .width(originalInputWidth);
            
            $OriginalInput.remove();
        });
    };
})(jQuery);
