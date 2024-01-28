using System.ComponentModel.DataAnnotations;
using LinkShortner.Domain.Exceptions;
using LinkShortner.Domain.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LinkShortner.Api.Filters;

public class ExceptionHandlerFilter : ExceptionFilterAttribute
{
    private readonly IDictionary<Type, Action<ExceptionContext>> _handlers;

    public ExceptionHandlerFilter()
    {
        _handlers = new Dictionary<Type, Action<ExceptionContext>>
        {
            { typeof(ValidationException), HandleValidationException },
            { typeof(NotFoundException), HandleNotFoundException },
        };
    }

    public override void OnException(ExceptionContext context)
    {
        var type = context.Exception.GetType();
        if (_handlers.ContainsKey(type))
        {
            _handlers[type].Invoke(context);
            return;
        }

        base.OnException(context);
    }

    private void HandleValidationException(ExceptionContext context)
    {
        var exception = (ValidationException)context.Exception;

        context.Result = new BadRequestObjectResult(new MessageResult(exception.Message));
        context.ExceptionHandled = true;
    }

    private void HandleNotFoundException(ExceptionContext context)
    {
        var exception = (NotFoundException)context.Exception;

        context.Result = new NotFoundObjectResult(new MessageResult(exception.Message));
        context.ExceptionHandled = true;
    }
}