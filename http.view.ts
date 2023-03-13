namespace $.$$ {

	export class $hyoo_http extends $.$hyoo_http {

		uri( next? : string ) {
			return this.$.$mol_state_arg.value( 'uri' , next ) || super.uri()
		}

		request_headers( next? : string ) : string{
			return this.$.$mol_state_arg.value( 'headers' , next ) || ''
		}

		request_headers_dict() {
			const dict = {} as Record< string , string >
			const lines = this.request_headers().split( /[\r\n]/g ).filter( line => line.trim() )
			for( const line of lines ) {
				const pair = line.split( ': ' )
				dict[ pair[0] ] = pair[1]
			}
			return dict
		}

		request_body( next? : string ) {
			return this.$.$mol_state_arg.value( 'body' , next ) || ''
		}
		
		@ $mol_mem
		request_params( next = {
			uri: '',
			method: 'get',
			headers: {},
			body: undefined as string | undefined,
		} ) {
			return next
		}
		
		submit() {
			this.request_params({
				uri: this.uri(),
				method: this.method() ,
				headers: this.request_headers_dict() ,
				body: this.request_body() || undefined ,
			} )
		}

		@ $mol_mem
		response() {
			this.$.$mol_wait_timeout( 1000 )
			const { uri, ... params } = this.request_params()
			return this.$.$mol_fetch.response( uri, params )
		}
		
		response_output() {
			try {
				this.response()
				return super.response_output()
			} catch( error: any ) {
				if( error instanceof Promise ) $mol_fail_hidden( error )
				return [ this.Response_error( error ) ]
			}
		}
		
		response_error( error: Error ) {
			return error.message ?? error
		}

		@ $mol_mem
		response_headers() {
			let lines = [] as string[]
			for( const [ name , value ] of this.response().headers() ) {
				lines.push( `${name}: ${value}` )
			}
			return lines.join('\n')
		}

		@ $mol_mem
		response_body() {
			return this.response().text()
		}

	}

}
