$(function() {
  var TodoApp = {
    onReady: function () {
      this._initPanels();
      this._initEventHandlers();
      this._initSavedItems();
    },

    onNewTodo: function () {
      var new_value = $("#add_todo_field").val();
      $("#add_todo_field").val('');

      $("#new-todo-dialog").popup("close");
      $("#todos_listview").prepend("<li class='todo'><input data-role='none' type='checkbox'><span> " + new_value + "</span></li>");
      $("#todos_listview").listview('refresh');
    },

    onClear: function () {
      $("#todos_listview").empty();
      $("#todos_listview").listview('refresh');
    },

    onSaveTodo: function () {

    },

    onTap: function () {
      var input_field = $(this).find('input');
      input_field.prop("checked", !input_field.is(':checked'));
      return false;
    },

    onKeypressed: function (e) {
      if (e.which == 13) {
        e.preventDefault();
        TodoApp.onNewTodo();
      }
    },

    onSwipeleftOrRight: function (e) {
      var todoitem = $(this),
        // classnames used for the CSS transition
        dir = e.type === "swipeleft" ? "left" : "right";

      todoitem.addClass( dir )
        .on( "webkitTransitionEnd transitionend otransitionend", function() {
          todoitem.remove();
          $( "#todos_listview" ).listview( "refresh" );
        });
    },

    _initPanels: function () {
      $( "body>[data-role='panel']" ).panel();
      $( "body>[data-role='panel'] [data-role='listview']" ).listview();
    },

    _initEventHandlers: function () {
      $("#todos_listview").on('swipeleft swiperight', '.todo', this.onSwipeleftOrRight);
      $("#todos_listview").on('tap', '.todo', this.onTap);
      $("#add_todo_button").on('click', this.onNewTodo);
      $("#add_todo_field").keypress(this.onKeypressed);
      $("#clear_list_button").on('click', this.onClear);
    },

    _initSavedItems: function () {}
  };

  window.TodoApp = TodoApp;

  TodoApp.onReady();
});
