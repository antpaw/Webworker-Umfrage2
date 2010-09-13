<?php
	if(!empty($_POST)){
		$_POST['time'] = time();
		$_POST['ip'] = $_SERVER['REMOTE_ADDR'];
		$data = json_encode($_POST);
		$data = ",\n" . $data;
		$handle = fopen('r.json', 'a+');
		fwrite($handle, $data);
		fclose($handle);
		header('Location: http://www.peterkroener.de/umfrage/danke');
	}
	else{
		include('header.tpl');
?>



<h1>Die große Webworker-Stundensatzumfrage 2.0</h1>
<p>
	Mit dieser Umfrage soll ergründet werden, was (selbstständige) Webworker so für Ihre Dienste nehmen. Die Umfrage richtet sich an alle, die
	auf eigene Rechnung Websites gestalten und/oder programmieren. <strong>Alle Fragen können ausgelassen oder mit "Keine Angabe" beantwortet
	werden.</strong> Es werden neben den Antworten nur die Uhrzeit sowie die IP-Adresse des Ausfüllenden gespeichert. Die Ergebnisse werden
	nach dem Ende der Umfrage sowohl in aufbereiteter Form wie auch als Rohdaten auf <a href="http://www.peterkroener.de/weblog">peterkroener.de/weblog</a>
	veröffentlicht.
</p>
<form action="index.php" method="post">
<fieldset>
<ol>


<li>
	<label for="satz">In welchem Bereich liegt dein Netto-Stundensatz?</label>
	<select id="satz" name="stundensatz">
		<option value="0">Keine Angabe</option>
		<option value="u40">&lt; 30 €</option>
		<option value="u30">30 - 39 €</option>
		<option value="u50">40 - 49 €</option>
		<option value="u60">50 - 59 €</option>
		<option value="u70">60 - 69 €</option>
		<option value="u80">70 - 79 €</option>
		<option value="u80">80 - 89 €</option>
		<option value="u90">90 - 99 €</option>
		<option value="100">100+ €</option>
	</select>
</li>


<li>
	<label for="form">In welcher Form bist du im Webwork-Bereich tätig?</label>
	<select id="form" name="wie">
		<option value="0">Keine Angabe</option>
		<option value="vollzeit">Vollzeit-Selbstständiger</option>
		<option value="teilzeit">Teilzeit-Selbstständiger</option>
		<option value="schueler">Schüler/Studentenjob</option>
		<option value="hobby">Hobbyist</option>
	</select>
</li>


<li>
	<label for="zeit">Wie lange bist du schon Webwork-Bereich tätig?</label>
	<select id="zeit" name="zeit">
		<option value="0">Keine Angabe</option>
		<option value="1">1 Jahr oder weniger</option>
		<option value="3">1 - 3 Jahre</option>
		<option value="5">3 - 5 Jahre</option>
		<option value="10">5 - 10 Jahre</option>
		<option value="10+">Über 10 Jahre</option>
	</select>
</li>


<li>
	<label for="wo">Wo arbeitest du?</label>
	<select id="wo" name="wo">
		<option value="0">Keine Angabe</option>
		<option value="bw">Baden-Württemberg</option>
		<option value="by">Bayern</option>
		<option value="be">Berlin</option>
		<option value="bb">Brandenburg</option>
		<option value="hb">Bremen</option>
		<option value="hh">Hamburg</option>
		<option value="he">Hessen</option>
		<option value="mv">Mecklenburg-Vorpommern</option>
		<option value="ni">Niedersachsen</option>
		<option value="nw">Nordrhein-Westfalen</option>
		<option value="rp">Rheinland-Pfalz</option>
		<option value="sl">Saarland</option>
		<option value="sn">Sachsen</option>
		<option value="st">Sachsen-Anhalt</option>
		<option value="sh">Schleswig-Holstein</option>
		<option value="th">Thüringen</option>
		<option value="ch">Schweiz</option>
		<option value="at">Österreich</option>
		<option value="o">Anderswo</option>
	</select>
</li>


<li>
	Was machst du hauptsächlich?
	<br>
	<label><input type="checkbox" name="webdesign" value="1">Webdesign</label>
	<label><input type="checkbox" name="frontend" value="1">Frontend-Entwicklung (HTML, CSS, JS)</label>
	<label><input type="checkbox" name="backend" value="1">Backend-Entwicklung (PHP, Ruby, Python)</label>
	<label><input type="checkbox" name="beratung" value="1">Beratung und/oder Schulung</label>
	<label><input type="checkbox" name="sonstiges" value="1">Andere, hier nicht aufgeführte Dinge</label>
	<small>Bitte nur die <strong>Schwerpunkte</strong> auswählen</small>
</li>


<li>
	Woher kommen deine Kunden hauptsächlich?
	<br>
	<label><input type="checkbox" name="umgebung" value="1">Unmittelbare Umgebung</label>
	<label><input type="checkbox" name="land" value="1">Ganzes Land</label>
	<label><input type="checkbox" name="euausland" value="1">Europäisches Ausland</label>
	<label><input type="checkbox" name="ausland" value="1">Sonstiges Ausland</label>
	<small>Bitte nur die <strong>Schwerpunkte</strong> auswählen</small>
</li>


<li>
	Über dich:
	<br>
	<label for="alter">Wie alt bist du?
		<select id="alter" name="alter">
			<option value="0">Keine Angabe</option>
			<option value="u20">&lt; 20</option>
			<option value="u30">20 - 29</option>
			<option value="u40">30 - 39</option>
			<option value="u50">40 - 49</option>
			<option value="u60">50 - 59</option>
			<option value="60">60+</option>
		</select>
	</label>
	<label for="ges">Dein Geschlecht?
		<select id="ges" name="geschlecht">
			<option value="0">Keine Angabe</option>
			<option value="m">Männlich</option>
			<option value="w">Weiblich</option>
			<option value="o">Anderes</option>
		</select>
	</label>
</li>

<p><input type="submit" id="submit" value="Abschicken!"></p>

</ol>
</fieldset>
</form>



<?php
		include('footer.tpl');
	}
?>
