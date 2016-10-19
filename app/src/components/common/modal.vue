<template>
	<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-container">
    <div class="modal-content">
    	<slot name="content"></slot>
    </div>
  </div>
  <button class="modal-close"></button>
</div>
</template>

<script>
	export default {

	}
</script>
