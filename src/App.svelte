<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	import App_edex from "./front/education_expenditures/App_edex.svelte";
	import illiteracy from "./front/illiteracy/illiteracyApp.svelte";
	import illiteracy_edit from "./front/illiteracy/Edit_Tables.svelte";
	
	const routes = {
		"/":Home,
		"/info":Info,
		"/education_expenditures":App_edex,
		"/illiteracy":illiteracy,
		"/illiteracy/:country/:date":illiteracy_edit,
		
		'*': NotFound //Debe ir la última o se ejecutará antes y la tomará como no encontrada
		
		};




</script>

<main>
	<Router {routes}> </Router>

	
</main>

<style>
</style>