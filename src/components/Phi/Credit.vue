<template>
<div id="phi-credit">

		<section>
			<h2># {{credit.sequence}}</h2>
			<div class="types phi-card _z-0">
				<div class="label"><span class="fa fa-user-o"></span>{{person.firstname}} </div>
				<div class="label"><span class="fa fa-calendar-check-o"></span> Fecha {{credit.date|moment.format}}</div>
				<div class="label"><span class="fa fa-calendar-times-o"></span> Fecha contable {{credit.effective_date|moment.format}}</div>
				<div class="label"><span class="fa fa-money"></span> Total pagado {{credit.value|currency}}</div>
			</div>
		</section>

		<br><br><br>

		<section>
			<h2>conceptos pagados</h2>
			<div class="types phi-card _z-0">
				<div class="concepts" v-for="debit in credit.debits">
					<div class="concept_name">
						<p><b>{{debit.period.name}} <small>#{{debit.sequence}}</small></b></p>
						<div class="concepts" v-for="item in debit.distributions">
              <p>{{item.price.concept.name}} <small>({{item.price.name}})</small></p>
					    <div class="balance">{{item.value|currency}}</div>
            </div>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>
import app from '../../store/app.js'

export default{
  props: {
		id: {
			type: String,
			required: true
		},
    model: {
      type: Object
    }
  },

  data() {
    return {
      credit: this.model,
      method: {},
      person: {}
    }
  },


  mounted(){

    if (this.credit == null) {
      app.api.get(`v3/credits/${this.id}`)
      .then(data => {
        this.credit = data;
        this.method = data.method;
        this.person = data.person;
      });
    } else {
        this.method = this.credit.method;
        this.person = this.credit.person;
    }
  }
}

</script>

<style lang="scss" scoped>
#phi-credit {
	section {
		h2 {
			color: #666;
			font-size: 0.8em;
			font-weight: 1em;
			margin-bottom: 0.5em;
			text-transform: uppercase;
		}
		.label {
			padding: 7px;

			.fa {
				margin-right: 15px;
			}
		}
	}

	.button-pay {
		right: 0;
		width: 140px;
		padding: 10px;
		position: fixed;
		text-align: right;
		margin-top: 15px;
		background: #2196F3;
		margin-bottom: 15px;
		border-radius: 38px 0px 0px 38px;
		-webkit-transition: all 0.3s ease;
		-o-transition: all 0.3s ease;
		transition: all 0.3s ease;

		button {
			width: 80%;
			color: #fff;
			border: none;
			font-size: 18px;
			cursor: pointer;
			background: transparent;
		}
	}
	.button-pay:hover {
		width: 150px;
		padding-left: 35px;
	}

	// conceptos

	.concepts {
		padding: 10px;
		display: flex;
		flex-wrap:wrap;
		justify-content: center;
		border-bottom: 1px dashed #ddd;
		transition:  all 0.2s ease;

		.concept_name {
			flex-grow: 1;
			width: 300px;

			p:nth-child(2) {
				font-size: 14px;
				font-style: italic;
			}
		}
		.balance {
			text-align: right;
			flex-grow: 1;
			width: 200px;
		}
	}
	.concepts:nth-last-child(1) {
		border: none;
	}
	.concepts:hover {
		background: #FAFAFA;
	}
}
</style>
