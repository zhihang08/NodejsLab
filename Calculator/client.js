$(function(){
  Calculator.initInterFace();
});
var Calculator = function(){
  return {
    status: {},
    initInterFace: function(){
      renderNumber();
      renderOperator();
      renderResult();
      function renderNumber() {
        var $numBtn = null;
        for (var i = 9; i >= 0; i--) {
          $numBtn = $("<div class='num_" + i + "'>" + i + "</div>");
          $(".cal_num").append($numBtn);
        }
        $numBtn = $("<div class='num_point'>.</div>");
        $(".cal_num").append($numBtn);
      }
      function renderOperator() {
        var $operator_addition = $("<div class='opt_add'>+</div>");
        var $operator_subtraction = $("<div class='opt_sub'>-</div>");
        var $operator_multiplication = $("<div class='opt_mul'>*</div>");
        var $operator_division = $("<div class='opt_div'>/</div>");
        var $operator_equal = $("<div class='opt_equ'>=</div>");
        $(".cal_operator").append($operator_addition).append($operator_subtraction)
        .append($operator_multiplication).append($operator_division).append($operator_equal);
      }
      function renderResult() {
          var $resultPanel = $("<div class='rlt_panel'><input type='search' placeholder='='></input></div>");
          $(".cal_result").append($resultPanel);
      }
    },
    initState: function () {
      Calculator.status.currentNum = 0;
      Calculator.status.inputNum = 0;
      Calculator.status.operator = null;
    },
    calculate: function (operator, currentNum, inputNum) {
      if (operator) {

      }
      else {

      }
    }
  }
}();
