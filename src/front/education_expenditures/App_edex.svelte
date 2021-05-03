<script>
import EdexTable from './Edex_Table.svelte';
import {Container, Row, Col} from 'sveltestrap';
</script>

<main>
    <div class="grid-block" style="background-image: url('images/fondo_edex.png'); width: 10; height: 10; ">
        <div class="grid-block" style="background-color:rgb(245, 181, 128);border-radius:4%; padding:1%;">
            <em><h1 class="display-3" style="text-align: center;" >Gastos en educación</h1></em>
        </div>
        
    </div>
	<div>
		<EdexTable/>
	</div>


</main>

<style>
    div{
        padding: 5%;
    }
</style>