
console.log('hi')

function adder(a,b,cb)
{
    console.log(a+b);
    setTimeout(cb,4000);
}

adder(5,3,function(){console.log('adder')});

setTimeout(function cemb()
{
    console.log('inside');
},1000)

console.log('bye');