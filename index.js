console.log('Fibonacci Function');

exports.handler = function(event, context) {

    //Se reciben las variables del JSON inicial
    var credit_line_id = event.credit_line_id;
    var algorithm_id = event.algorithm_id;
    var identification = event.identification;
    var identification_type = event.identification_type;
    var principal = event.principal;
    var number_of_payments = event.number_of_payments;
    var interest_rate = event.interest_rate;
    
    //Se calculan los timestamps
    var created_at = new Date();
    var updated_at = new Date();
    
    //Variables para calcular los payments
    var payments = [];
    var monthlyInterest = (Math.pow(1+(interest_rate/100), 1.0/12.0)-1)*100;
    var pendingBalance = principal;
    var totalPaid = 0;

    //Se construyen los payments del PaymentPlan
    for(var i = 1; i <= number_of_payments; i++){	  		
  			var payment_total = principal*((monthlyInterest/100.0*Math.pow(1+monthlyInterest/100.0,number_of_payments))/(Math.pow(1+monthlyInterest/100.0,number_of_payments)-1));
  			var interestPayment = principal*monthlyInterest/100.0;
  			var amortizationPayment = pendingBalance - interestPayment;
  			pendingBalance -= amortizationPayment;    
  			totalPaid += amortizationPayment;         
  			var p =  new Payment(i, payment_total, interestPayment, amortizationPayment, pendingBalance, totalPaid);
  			payments.push(p);
  		}
    
    //Se construye el plan de pagos con todos sus atributos
    var paymentPlan = new PaymentPlan(credit_line_id, algorithm_id, identification, identification_type, principal, number_of_payments, interest_rate, created_at, updated_at, payments);
    fibonacciRecursion(39);
   
    //Se hace doble conversion para que el JSON se muestre correctamente
    var jsonString = JSON.stringify(paymentPlan);
    var jsonObj = JSON.parse(jsonString);
    context.succeed(jsonObj);
};

//Entidad PaymentPlan
var PaymentPlan = function (credit_line_id, algorithm_id, identification, identification_type, principal, number_of_payments, interest_rate, created_at, updated_at, payments) {
    this._credit_line_id = credit_line_id;
    this._algorithm_id = algorithm_id;
    this._identification = identification;
    this._identification_type = identification_type;
    this._principal = principal;
    this._number_of_payments = number_of_payments;
    this._interest_rate = interest_rate;
    this._created_at = created_at;
    this._updated_at = updated_at;
    this._payments = payments;
};

//Entidad Payment
var Payment = function (payment_number, payment_total, payment_interest, payment_amortization, pending_balance, total_paid) {
    	this._payment_number = payment_number;
		this._payment_total = payment_total;
		this._payment_interest = payment_interest;
		this._payment_amortization = payment_amortization;
		this._pending_balance = pending_balance;
		this._total_paid = total_paid;
};

//Recursion Fibonacci
function fibonacciRecursion(number){
	if(number == 1 || number == 2){
	    return 1;
	}
    return fibonacciRecursion(number - 1) + fibonacciRecursion(number - 2);
}