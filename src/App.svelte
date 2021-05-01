<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	
	const routes = {
		"/":Home,
		"/info":Info,
		'*': NotFound
		};
</script>

<main>
	<Router {routes}> </Router>
</main>

<style>
</style>