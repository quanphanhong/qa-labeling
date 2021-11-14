export async function downloadJSONFile( data, fileName ) {
    const blob = new Blob( [ data ], { type: 'application/json' });
    const href = await URL.createObjectURL( blob );
    const link = document.createElement( 'a' );

    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild( link );

    link.click();
    document.body.removeChild( link );
}