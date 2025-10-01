
<script>
    let counter = $state(0);

    function increment() {
        counter++;
    }
</script>


<h1 onclick="{increment}">Hello {counter}</h1>