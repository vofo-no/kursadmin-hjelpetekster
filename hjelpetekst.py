#!/usr/local/bin/python
# coding: utf-8
"""Applikasjon for hjelpetekster i KursAdmin."""

import os
import urllib

import webapp2
import json
import jinja2

from google.appengine.api import users
from google.appengine.ext import ndb
from google.appengine.api import mail
from google.appengine.api import app_identity
import cloudstorage as gcs

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

studieforbund = [
	#{ 'nr':'350','navn':u'Akademisk studieforbund' },
	#{ 'nr':'320','navn':u'Kristelig studieforbund' },
	#{ 'nr':'250','navn':u'Musikkens studieforbund' },
	#{ 'nr':'270','navn':u'Samisk studieforbund' },
	#{ 'nr':'340','navn':u'Senterpartiets studieforbund' },
	#{ 'nr':'300','navn':u'Sosialistisk Venstrepartis studieforbund' },
	#{ 'nr':'220','navn':u'Studieforbundet AOF Norge' },
	#{ 'nr':'210','navn':u'Studieforbundet Folkeuniversitetet' },
	{ 'nr':'200','navn':u'Studieforbundet Funkis' },
	#{ 'nr':'290','navn':u'Studieforbundet kultur og tradisjon' },
	#{ 'nr':'320','navn':u'Studieforbundet natur og miljø' },
	#{ 'nr':'240','navn':u'Studieforbundet næring og samfunn' },
	#{ 'nr':'330','navn':u'Studieforbundet solidaritet' },
	#{ 'nr':'310','navn':u'Venstres opplysnings- og studieforbund' },
	{ 'nr':'230','navn':u'Voksenopplæringsforbundet' }
	]
sider = [
	{ 'nr':'101','navn':u'Logg inn' },
	{ 'nr':'1000','navn':u'Hjem forside' },
	{ 'nr':'2000','navn':u'Studieplan søk' },
	{ 'nr':'2410','navn':u'Rediger studieplan steg 1' },
	{ 'nr':'2520','navn':u'Rediger studieplan steg 2' },
	{ 'nr':'2420','navn':u'Rediger studieplan steg 3' },
	{ 'nr':'2430','navn':u'Rediger studieplan steg 4' },
	{ 'nr':'2440','navn':u'Rediger studieplan steg 5' },
	{ 'nr':'2480','navn':u'Rediger studieplan steg 6' },
	{ 'nr':'2470','navn':u'Rediger studieplan steg 7' },
	{ 'nr':'2450','navn':u'Rediger studieplan steg 8' },
	{ 'nr':'2460','navn':u'Rediger studieplan steg 9' },
	{ 'nr':'2490','navn':u'Rediger studieplan steg 10' },
	{ 'nr':'2510','navn':u'Rediger studieplan steg 11' },
	{ 'nr':'2500','navn':u'Rediger studieplan steg 12' },
	{ 'nr':'2300','navn':u'Læremidler' },
	{ 'nr':'3110','navn':u'Rediger kurs - steg 1' },
	{ 'nr':'3210','navn':u'Rediger kurs - steg 2' },
	{ 'nr':'3120','navn':u'Rediger kurs - steg 3' },
	{ 'nr':'3130','navn':u'Rediger kurs - steg 4' },
	{ 'nr':'3140','navn':u'Rediger kurs - steg 5' },
	{ 'nr':'3150','navn':u'Rediger kurs - steg 6' },
	{ 'nr':'3160','navn':u'Rediger kurs - steg 7' },
	{ 'nr':'3170','navn':u'Rediger kurs - steg 8' },
	{ 'nr':'3180','navn':u'Rediger kurs - steg 9' },
	{ 'nr':'3190','navn':u'Rediger kurs - steg 10' }
	]

"""Studieforbund-nøkkel"""
def studieforbund_key(studieforbund_nr='0000',side='0'):
	return ndb.Key('StudieforbundSide', studieforbund_nr + ':' + side)

"""Modell for hjelpetekster."""
class Hjelpetekst(ndb.Model):
	selector = ndb.StringProperty(default='',required=True)
	tittel = ndb.StringProperty(indexed=False,default='',required=True)
	tekst = ndb.StringProperty(indexed=False,default='')
	video = ndb.TextProperty(indexed=False,default='')
	link = ndb.TextProperty(indexed=False,default='')
	endret = ndb.DateTimeProperty(auto_now=True,indexed=False)
	bruker = ndb.UserProperty(indexed=False)
	publisert = ndb.BooleanProperty()
	
	@classmethod
	def query_side(cls, stf, side):
		return cls.query(ancestor=studieforbund_key(stf, side)).order(cls.selector)

	@classmethod
	def query_side_public(cls, stf, side):
		return cls.query(cls.publisert == True, ancestor=studieforbund_key(stf, side)).order(cls.selector)

"""Modell for autorisasjon av brukere til ulike studieforbund. Hvis bruker ikke er admin, kreves en autorisasjon for det aktuelle studieforbundet."""
class Autorisasjon(ndb.Model):
	bruker = ndb.UserProperty(auto_current_user_add=True,indexed=True)
	godkjent = ndb.BooleanProperty(default=False)
	merknad = ndb.StringProperty(indexed=False)
	dato = ndb.DateTimeProperty(auto_now_add=True,indexed=False)
	endret = ndb.DateTimeProperty(auto_now=True,indexed=False)
	endret_av = ndb.UserProperty(auto_current_user=True,indexed=False)
	
	@classmethod
	def get_auth(cls, stf, user):
		return cls.query(cls.bruker == user, ancestor=studieforbund_key(stf))
	@classmethod
	def get_requests(cls, stf):
		return cls.query(ancestor=studieforbund_key(stf)).order(cls.bruker)
	
class MainPage(webapp2.RequestHandler):
	def get(self, stf, side, entity):
		autorisasjoner = []
		if users.get_current_user():
			url = users.create_logout_url(self.request.uri)
			user = users.get_current_user().nickname()
			if stf:
				"""Sjekk autorisasjon, og om det finnes ventende forespørsler."""
				if users.is_current_user_admin():
					editor = True
					pending = False
					#TODO: Liste over autorisasjoner og forespørsler.
					autorisasjoner = Autorisasjon.get_requests(stf).fetch()
				else:
					autorisasjon = Autorisasjon.get_auth(stf, users.get_current_user()).fetch(1, projection=[Autorisasjon.godkjent])
					if autorisasjon: #Autorisasjon eller forespørsel.
						editor = autorisasjon[0].godkjent
						pending = not editor
					else: #Ingen autorisasjon eller forespørsler.
						editor = False
						pending = False
			else: #Editor er irrelevant hvis stf ikke er valgt.
				editor = False
				pending = False
		else:
			url = users.create_login_url(self.request.uri)
			editor = False
			pending = False
			user = ''
		if stf and side:
			if entity:
				try:
					if entity == 'create':
						hjelpetekster = [Hjelpetekst()]
					else:
						ht_key = ndb.Key(urlsafe=entity)
						if not ht_key.parent() == studieforbund_key(stf, side):
							self.response.write("Den valgte oppføringen finnes ikke her. Den kan ha blitt slettet eller flyttet.")
							self.response.set_status(404)
							return
						hjelpetekster = [ht_key.get()]
				except:
					self.response.write("Systemet klarte ikke å hente oppføringen fra databasen. Kontroller at id-strengen er riktig. Kontakt VOFO dersom problemet fortsetter.")
					self.response.set_status(500)
					return
			else:
				hjelpetekster = Hjelpetekst.query_side(stf, side).fetch()
		else:
			hjelpetekster = None
		template_values = {'loginUrl':url,'studieforbund':studieforbund,'stf':stf,'sider':sider,'side':side,'hjelpetekster':hjelpetekster,'entity':entity,'editor':editor,'pending':pending,'user':user,'autorisasjoner':autorisasjoner}
		template = JINJA_ENVIRONMENT.get_template('admin_template.html')
		self.response.write(template.render(template_values))
	def post(self, stf, side, entity):
		if users.get_current_user():
			if users.is_current_user_admin():
				editor = True
			else:
				autorisasjon = Autorisasjon.get_auth(stf, users.get_current_user()).fetch(1, projection=[Autorisasjon.godkjent])
				if autorisasjon: #Autorisasjon eller forespørsel.
					editor = autorisasjon[0].godkjent
				else: #Ingen autorisasjon eller forespørsler.
					editor = False
				if not editor:
					self.response.write("Ingen tilgang. Du er ikke autorisert til å gjøre endringer her.")
					self.response.set_status(403)
					return
		else:
			self.response.write("Ingen tilgang. Du må være logget inn for å gjøre endringer i systemet.")
			self.response.set_status(403)
			return
		if stf and side:
			if entity == 'publiser':
				bucket_name = os.environ.get('BUCKET_NAME', app_identity.get_default_gcs_bucket_name())
				gcs_filename = '/' + bucket_name + '/h1/' + str(stf) + '-' + str(side) + '.json'
				gcs_file = gcs.open(gcs_filename, 'w', content_type='application/json', options={'x-goog-acl': 'public-read'})
				gcs_file.write(hjelpeteksterJSON(stf, side))
				gcs_file.close()
				self.response.set_status(202) # Accepted.
				return
			elif entity:
				successnummer = '0'
				try:
					if entity == 'create':
						hjelpetekst = Hjelpetekst(parent=studieforbund_key(stf, side))
						successnummer = '1'
					else:
						ht_key = ndb.Key(urlsafe=entity)
						if not ht_key.parent() == studieforbund_key(stf, side):
							self.response.write("Den valgte oppføringen finnes ikke her. Den kan ha blitt slettet eller flyttet.")
							self.response.set_status(404)
							return
						hjelpetekst = ht_key.get()
						successnummer = '2'
				except:
					self.response.write("Systemet klarte ikke å hente oppføringen fra databasen. Kontroller at id-strengen er riktig. Kontakt VOFO dersom problemet fortsetter.")
					self.response.set_status(500)
					return
				try:
					hjelpetekst.selector = self.request.get('selector')
					hjelpetekst.tittel = self.request.get('tittel')
					hjelpetekst.tekst = self.request.get('tekst')
					hjelpetekst.video = self.request.get('video')
					hjelpetekst.link = self.request.get('link')
					hjelpetekst.publisert = bool(self.request.get('publisert'))
					hjelpetekst.bruker = users.get_current_user()
					hjelpetekst.put()
				except:
					self.response.write("Forespørselen din inneholder feil, som gjør at posten ikke kan lagres.")
					self.response.set_status(400)
					return
			self.redirect('/' + stf + '/' + side + '?success=' + successnummer)
		else:
			self.response.write("Denne handlingen er ikke implementert.")
			self.response.set_status(501)
			return
			
class AuthHandler(webapp2.RequestHandler):
	def put(self, stf, akey):
		"""Oppretter en ny forespørsel om tilgang. Ignoreres dersom forespørselen finnes."""
		autorisasjon = Autorisasjon.get_auth(stf, users.get_current_user()).fetch(1)
		if autorisasjon:
			self.response.set_status(304) # Not modified.
		else:
			autorisasjon = Autorisasjon(parent = studieforbund_key(stf))
			autorisasjon.merknad = self.request.get('merknad')
			autorisasjon.put()
			mail.send_mail(sender="KursAdmin hjelpetekst <mg@vofo.no>",
              to="Mats Grimsgaard <mg@vofo.no>",
              subject="Søknad om tilgang til stf " + stf,
              body=u"""
				Hei Mats

				Brukeren %s 
				søker om tilgang til hjelpetekst-appen for KursAdmin.

				Melding fra brukeren:
				%s

				Fiks tilgang på https://hjelpetekst.appspot.com/%s

				Lykke til!

				Hilsen hjelpetekst-appen
				""" % (autorisasjon.bruker, autorisasjon.merknad, stf))
			self.response.set_status(202) # Accepted.
	def post(self, stf, akey):
		"""Godkjenner en forespørsel. Krever admin."""
		if users.is_current_user_admin():
			authkey = ndb.Key(urlsafe=akey)
			autorisasjon = authkey.get()
			autorisasjon.godkjent = True
			autorisasjon.put()
			mail.send_mail(sender="KursAdmin hjelpetekst <mg@vofo.no>",
              to=autorisasjon.bruker.email(),
              subject="Du har fått tilgang til hjelpetekst-appen",
              body=u"""
				Hei

				Du har nå fått tilgang til hjelpetekst-appen for KursAdmin!

				Logg inn på https://hjelpetekst.appspot.com/

				Lykke til!

				Hilsen hjelpetekst-appen
				""")
			self.response.set_status(202) # Accepted.
		else:
			self.response.set_status(403) # Forbidden.
	def delete(self, stf, akey):
		"""Sletter en autorisasjon. Krever admin."""
		if users.is_current_user_admin():
			authkey = ndb.Key(urlsafe=akey)
			authkey.delete()
			self.response.set_status(202) # Accepted.
		else:
			self.response.set_status(403) # Forbidden.

class Hjelpetekster(webapp2.RequestHandler):
	def get(self, stf, side):
		self.response.headers['Access-Control-Allow-Origin'] = 'http://test.senitel.no'
		self.response.headers['Content-Type'] = 'application/json'
		self.response.write(hjelpeteksterJSON(stf, side))

def hjelpeteksterJSON(stf, side):
		hjelpetekster = Hjelpetekst.query_side_public(stf, side).fetch()
		#if side <> '0':
		#	hjelpetekster.extend(Hjelpetekst.query_side_public(stf, '0').fetch())
		if(len(hjelpetekster)>0):
			return '{"hjelp": ' + json.dumps([p.to_dict(include=['selector', 'tittel', 'tekst', 'video', 'link']) for p in hjelpetekster]) + '}'
		else:
			return '{}'
	
app = webapp2.WSGIApplication([('/([0-9]*)/?([0-9]*)/?([^/]*)', MainPage),
	('/auth/([0-9]+)/?([^/]*)', AuthHandler),
	('/json-dev/([0-9]+)-([0-9]+)\.json', Hjelpetekster)], debug=True)