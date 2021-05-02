<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	import Education_Expenditures from "./front/education_expenditures/App.svelte";
	import illiteracy from "./front/illiteracy/illiteracyApp.svelte";
	
	const routes = {
		"/":Home,
		"/info":Info,
		'*': NotFound,
		"/education_expenditures":Education_Expenditures,
		"/illiteracy":illiteracy
		};




</script>

<main>
	<Router {routes}> </Router>
</main>

<style>
</style>