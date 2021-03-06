from django.conf import settings


class DevMiddleware(object):

	def process_view(self, request, view_func, view_args, view_kwargs):
		if settings.DEBUG and not hasattr(view_func, 'im_self'):
			view_func.csrf_exempt = True
		return view_func(request, *view_args, **view_kwargs)
