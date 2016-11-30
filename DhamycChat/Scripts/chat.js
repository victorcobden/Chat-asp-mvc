$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    var messages = [];

    var chat = $.connection.chatHub;

    function setMessageHtml(name, message, fulldate) {
        var messageText = '<div class="row msg_container base_sent">';
        messageText += '<div class="col-md-10 col-xs-10">';
        messageText += '<div class="messages msg_sent new-msg">';
        messageText += '<p>';
        messageText += message;
        messageText += '</p>';
        messageText += '<time><label class="label label-success">' + name + '</label> • ' + fulldate + '</time>';
        messageText += '</div>';
        messageText += '</div>';
        messageText += '<div class="col-md-2 col-xs-2 avatar">';
        messageText += '<img src="https://ssl.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png" class="img-responsive">';
        messageText += '</div>';
        messageText += '</div>';

        return messageText;
    }

    var fullDate = function () {
        var date = new Date();
        var fulldate = date.toLocaleTimeString();
        return fulldate;
    }

    if (localStorage.getItem("chat") === null) {
        localStorage.setItem('chat', JSON.stringify(messages));
    }
    else {
        messages = JSON.parse(localStorage.getItem('chat'));
        $.each(messages, function (i, item) {
            var loadMessage = setMessageHtml(item.username, item.message, item.date);
            $('.msg_container_base').append(loadMessage)
        })
        $(".msg_container_base").animate({ scrollTop: $('.msg_container_base')[0].scrollHeight }, 1000);
    }

    chat.client.addNewMessageToPage = function (name, message) {

        var messageText = setMessageHtml(htmlEncode(name), htmlEncode(message), fullDate());

        $('.msg_container_base').append(messageText).fadeIn(1, function () {
            $(".msg_container_base").animate({ scrollTop: $('.msg_container_base')[0].scrollHeight }, 1000);
            $('.messages').last().hide().fadeIn(500);
        });

        var getId = JSON.parse(localStorage.getItem('chat'));
        var id = getId.length + 1;
        var chat = { "id": id, "username": htmlEncode(name), "message": htmlEncode(message), "date": fullDate() };


        messages.push(chat);
        localStorage.setItem('chat', JSON.stringify(messages));

    };

    if (localStorage.getItem("user") === null) {
        var userNew = prompt('Enter your name:', '');
        localStorage.setItem("user", userNew);
        user = userNew;
    }

    var user = localStorage.getItem("user");

    $('#message').focus();

    $.connection.hub.start().done(function () {
        $('#formChat').submit(function () {
            if ($('#message').val() == "") {
            }
            else {
                chat.server.send(user, $('#message').val());
                $('#message').val('').focus();
            }
            return false;
        });
    });
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
    $(document).on('click', '.panel-heading span.icon_minim', function (e) {
        var $this = $(this);
        if (!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    });
    $(document).on('click', '.panel-heading span.icon_clear', function (e) {
        var option = confirm('All messages will be delete');
        if (option) {
            localStorage.removeItem('chat');
            $(".msg_container_base").empty();
        }
        return false;
    });
    $(document).on('click', '.panel-heading span.icon_user', function (e) {
        var userNew = prompt('Establecer nuevo nick', '');
        localStorage.setItem('user', userNew);
        user = userNew;
    });
    $(document).on('focus', '.panel-footer input.chat_input', function (e) {
        var $this = $(this);
        if ($('#minim_chat_window').hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideDown();
            $('#minim_chat_window').removeClass('panel-collapsed');
            $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    });
    $(document).on('click', '#new_chat', function (e) {
        var size = $(".chat-window:last-child").css("margin-left");
        size_total = parseInt(size) + 400;
        alert(size_total);
        var clone = $("#chat_window_1").clone().appendTo(".container");
        clone.css("margin-left", size_total);
    });
}); 